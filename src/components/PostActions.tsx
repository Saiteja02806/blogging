"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

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
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const loadData = useCallback(async () => {
    if (!postSlug) {
      return;
    }

    try {
      setError(null);
      const qs = encodeURIComponent(postSlug);

      const [likeRes, commentRes] = await Promise.all([
        fetch(`/api/likes?postSlug=${qs}`, { cache: "no-store" }),
        fetch(`/api/comments?postSlug=${qs}`, { cache: "no-store" }),
      ]);

      if (likeRes.status === 503 || commentRes.status === 503) {
        setBackendUnavailable(true);
        return;
      }

      setBackendUnavailable(false);

      if (!likeRes.ok) {
        const j = (await likeRes.json().catch(() => ({}))) as { error?: string };
        console.error("[likes API]", j);
        setError(j.error ?? "Could not load likes.");
      } else {
        const j = (await likeRes.json()) as { count?: number };
        setLikeCount(typeof j.count === "number" ? j.count : 0);
      }

      if (!commentRes.ok) {
        const j = (await commentRes.json().catch(() => ({}))) as { error?: string };
        console.error("[comments API]", j);
        setError((prev) => prev ?? (j.error ?? "Could not load comments."));
      } else {
        const j = (await commentRes.json()) as {
          comments?: Array<{ id?: string; name: string; text: string; created_at: string }>;
        };
        const rows = Array.isArray(j.comments) ? j.comments : [];
        setComments(
          rows.map((c) => ({
            id: c.id,
            name: c.name,
            text: c.text,
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
  }, [postSlug]);

  useEffect(() => {
    const storageKey = `liked-${postSlug}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === "1") setLiked(true);

    loadData();
  }, [postSlug, loadData]);

  const handleLike = async () => {
    if (!postSlug || backendUnavailable) return;

    const storageKey = `liked-${postSlug}`;
    const currentlyLiked = liked;
    const delta = currentlyLiked ? -1 : 1;

    setLiked(!currentlyLiked);
    setLikeCount((c) => Math.max(0, c + delta));
    localStorage.setItem(storageKey, currentlyLiked ? "" : "1");

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, delta }),
      });

      const j = (await res.json().catch(() => ({}))) as { error?: string; count?: number };

      if (!res.ok) {
        console.error("[like POST]", j);
        setError(j.error ?? "Could not save like.");
        setLiked(currentlyLiked);
        setLikeCount((c) => Math.max(0, c - delta));
        localStorage.setItem(storageKey, currentlyLiked ? "1" : "");
        return;
      }

      if (typeof j.count === "number") {
        setLikeCount(j.count);
      }

      setError(null);
    } catch (err) {
      console.error("[like] unexpected error:", err);
      setLiked(currentlyLiked);
      setLikeCount((c) => Math.max(0, c - delta));
      localStorage.setItem(storageKey, currentlyLiked ? "1" : "");
      setError("Could not save like.");
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postSlug || backendUnavailable) return;
    if (!commentText.trim() || !commenterName.trim()) return;

    setLoading(true);
    setError(null);

    const text = commentText.trim();
    const name = commenterName.trim();

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postSlug, name, text }),
      });

      const j = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
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

  if (backendUnavailable) {
    return (
      <div className="mt-12 border-t border-[var(--border-light)] pt-8">
        <p className="font-ui text-sm leading-relaxed text-[var(--text-tertiary)]">
          Likes and comments need Supabase credentials on the server. Set{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[0.8rem]">
            SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[0.8rem]">
            SUPABASE_ANON_KEY
          </code>{" "}
          (or{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[0.8rem]">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          /{" "}
          <code className="rounded bg-[var(--bg-secondary)] px-1.5 py-0.5 font-mono text-[0.8rem]">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          ) in your deployment environment, then redeploy.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 border-t border-[var(--border-light)] pt-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 font-ui text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Action Buttons */}
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

      {/* Comments Section */}
      {showComments && (
        <div className="mt-6 space-y-5">
          {/* Existing Comments */}
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

          {/* Comment Form */}
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
