"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

import { getOrCreateDeviceUserKey } from "@/lib/device-user";
import {
  appendLocalComment,
  readLocalComments,
  readLocalLikeCount,
  writeLocalLikeCount,
} from "@/lib/local-engagement";

interface PostActionsProps {
  postSlug: string;
}

interface CommentItem {
  id?: string;
  name: string;
  text: string;
  time: string;
}

export function PostActions({ postSlug }: PostActionsProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const hydrateFromLocalStorage = useCallback(() => {
    setLikeCount(readLocalLikeCount(postSlug));
    const rows = readLocalComments(postSlug);
    setComments(
      rows.map((c) => ({
        id: c.id,
        name: c.name,
        text: c.text,
        time: new Date(c.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
    );
  }, [postSlug]);

  const loadData = useCallback(async () => {
    if (!postSlug) {
      return;
    }

    const userKey = getOrCreateDeviceUserKey();
    if (!userKey) {
      return;
    }

    try {
      setError(null);
      const base = `/api/posts/${encodeURIComponent(postSlug)}`;

      const [likeRes, commentRes] = await Promise.all([
        fetch(`${base}/like?userKey=${encodeURIComponent(userKey)}`, { cache: "no-store" }),
        fetch(`${base}/comments`, { cache: "no-store" }),
      ]);

      if (likeRes.status === 503 || commentRes.status === 503) {
        setUseLocalFallback(true);
        hydrateFromLocalStorage();
        const storageKey = `liked-${postSlug}`;
        setLiked(localStorage.getItem(storageKey) === "1");
        return;
      }

      setUseLocalFallback(false);

      if (!likeRes.ok) {
        const j = (await likeRes.json().catch(() => ({}))) as { error?: string };
        console.error("[likes API]", j);
        setError(j.error ?? "Could not load likes.");
      } else {
        const j = (await likeRes.json()) as { count?: number; likedByMe?: boolean };
        setLikeCount(typeof j.count === "number" ? j.count : 0);
        setLiked(Boolean(j.likedByMe));
      }

      if (!commentRes.ok) {
        const j = (await commentRes.json().catch(() => ({}))) as { error?: string };
        console.error("[comments API]", j);
        setError((prev) => prev ?? (j.error ?? "Could not load comments."));
      } else {
        const j = (await commentRes.json()) as {
          comments?: Array<{
            id?: string;
            author_name?: string | null;
            body?: string;
            created_at: string;
          }>;
        };
        const rows = Array.isArray(j.comments) ? j.comments : [];
        setComments(
          rows.map((c) => ({
            id: c.id,
            name: c.author_name?.trim() || "Anonymous",
            text: c.body ?? "",
            time: new Date(c.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
          })),
        );
      }
    } catch (err) {
      console.error("[engagement] unexpected error:", err);
      setError("Failed to load engagement data.");
    }
  }, [postSlug, hydrateFromLocalStorage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLike = async () => {
    if (!postSlug) return;

    const userKey = getOrCreateDeviceUserKey();
    if (!userKey) return;

    const storageKey = `liked-${postSlug}`;
    const prevLiked = liked;
    const prevCount = likeCount;

    setLiked(!prevLiked);
    setLikeCount((c) => Math.max(0, c + (prevLiked ? -1 : 1)));
    localStorage.setItem(storageKey, prevLiked ? "" : "1");

    if (useLocalFallback) {
      const delta = prevLiked ? -1 : 1;
      const current = readLocalLikeCount(postSlug);
      const newCount = Math.max(0, current + delta);
      writeLocalLikeCount(postSlug, newCount);
      setLikeCount(newCount);
      setError(null);
      return;
    }

    try {
      const base = `/api/posts/${encodeURIComponent(postSlug)}`;
      const res = await fetch(`${base}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userKey }),
      });

      const j = (await res.json().catch(() => ({}))) as {
        error?: string;
        count?: number;
        likedByMe?: boolean;
      };

      if (!res.ok) {
        if (res.status === 503) {
          setUseLocalFallback(true);
          hydrateFromLocalStorage();
          setLiked(localStorage.getItem(storageKey) === "1");
          setError(null);
          return;
        }
        console.error("[like POST]", j);
        setError(j.error ?? "Could not save like.");
        setLiked(prevLiked);
        setLikeCount(prevCount);
        localStorage.setItem(storageKey, prevLiked ? "1" : "");
        return;
      }

      if (typeof j.count === "number") {
        setLikeCount(j.count);
      }
      setLiked(Boolean(j.likedByMe));
      localStorage.setItem(storageKey, j.likedByMe ? "1" : "");
      setError(null);
    } catch (err) {
      console.error("[like] unexpected error:", err);
      setLiked(prevLiked);
      setLikeCount(prevCount);
      localStorage.setItem(storageKey, prevLiked ? "1" : "");
      setError("Could not save like.");
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postSlug) return;
    if (!commentText.trim() || !commenterName.trim()) return;

    setLoading(true);
    setError(null);

    const comment = commentText.trim();
    const authorName = commenterName.trim();
    const userKey = getOrCreateDeviceUserKey();

    if (useLocalFallback) {
      appendLocalComment(postSlug, authorName, comment);
      hydrateFromLocalStorage();
      setCommentText("");
      setCommenterName("");
      setLoading(false);
      return;
    }

    try {
      const base = `/api/posts/${encodeURIComponent(postSlug)}`;
      const res = await fetch(`${base}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userKey, authorName, comment }),
      });

      const j = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        if (res.status === 503) {
          setUseLocalFallback(true);
          appendLocalComment(postSlug, authorName, comment);
          hydrateFromLocalStorage();
          setCommentText("");
          setCommenterName("");
          setLoading(false);
          return;
        }
        console.error("[comment POST]", j);
        setError(j.error ?? "Failed to post comment. Please try again.");
        setLoading(false);
        return;
      }

      await loadData();
      setCommentText("");
      setCommenterName("");
      setLoading(false);
    } catch (err) {
      console.error("[comment] unexpected error:", err);
      setError("Failed to post comment.");
      setLoading(false);
    }
  };

  if (!postSlug) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-[var(--border-light)] pt-8">
      {useLocalFallback ? (
        <p className="mb-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3 font-ui text-xs leading-relaxed text-[var(--text-tertiary)]">
          <strong className="font-medium text-[var(--text-secondary)]">Device-only mode.</strong>{" "}
          The API cannot reach Supabase (usually missing{" "}
          <code className="rounded bg-[var(--bg-primary)] px-1 py-0.5 font-mono text-[0.7rem]">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          on the server). Add{" "}
          <code className="rounded bg-[var(--bg-primary)] px-1 py-0.5 font-mono text-[0.7rem]">
            SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-[var(--bg-primary)] px-1 py-0.5 font-mono text-[0.7rem]">
            SUPABASE_SERVICE_ROLE_KEY
          </code>{" "}
          in{" "}
          <code className="rounded bg-[var(--bg-primary)] px-1 py-0.5 font-mono text-[0.7rem]">
            .env.local
          </code>{" "}
          (local) or Vercel → Environment Variables (production). Never commit secrets to Git.
        </p>
      ) : null}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-ui text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLike}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] px-4 py-2 font-ui text-sm transition-all duration-200 hover:border-[var(--border-medium)]"
          style={{
            borderColor: liked ? "var(--accent)" : undefined,
            backgroundColor: liked ? "var(--accent-subtle)" : undefined,
            color: liked ? "var(--accent)" : undefined,
          }}
        >
          <Heart
            className="h-4 w-4 transition-all duration-200"
            style={{
              fill: liked ? "var(--accent)" : "none",
              color: liked ? "var(--accent)" : "var(--text-secondary)",
            }}
          />
          <span
            style={{
              color: liked ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {likeCount > 0 ? likeCount : "Like"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleComment}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border-light)] px-4 py-2 font-ui text-sm text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-medium)] hover:text-[var(--text-primary)]"
          style={{
            borderColor: showComments ? "var(--accent)" : undefined,
            backgroundColor: showComments ? "var(--accent-subtle)" : undefined,
            color: showComments ? "var(--accent)" : undefined,
          }}
        >
          <MessageCircle
            className="h-4 w-4"
            style={{
              color: showComments ? "var(--accent)" : "var(--text-secondary)",
            }}
          />
          <span>
            {comments.length > 0 ? `${comments.length} Comment${comments.length > 1 ? "s" : ""}` : "Comment"}
          </span>
        </button>
      </div>

      {showComments && (
        <div className="mt-6 space-y-5">
          {comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment, i) => (
                <div
                  key={comment.id ?? `${comment.name}-${i}`}
                  className="rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 rounded-full bg-[var(--accent-subtle)] flex items-center justify-center font-ui text-xs font-semibold text-[var(--accent)]">
                      {comment.name[0]}
                    </div>
                    <span className="font-ui text-sm font-medium text-[var(--text-primary)]">
                      {comment.name}
                    </span>
                    <span className="font-ui text-xs text-[var(--text-tertiary)]">
                      {comment.time}
                    </span>
                  </div>
                  <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitComment} className="space-y-3">
            <input
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3 font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full resize-none rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3 font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!commentText.trim() || !commenterName.trim() || loading}
                className="rounded-full bg-[var(--accent)] px-5 py-2 font-ui text-sm font-semibold text-[var(--accent-foreground)] transition-all duration-200 hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
