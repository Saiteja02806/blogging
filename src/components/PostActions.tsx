"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface PostActionsProps {
  postSlug: string;
}

interface CommentItem {
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

  const loadData = useCallback(async () => {
    try {
      setError(null);

      // Load likes
      const { data: likeRows, error: likeErr } = await supabase
        .from("likes")
        .select("count")
        .eq("post_slug", postSlug)
        .maybeSingle();

      if (likeErr) {
        console.error("[Supabase] likes fetch error:", likeErr.message);
      } else if (likeRows) {
        setLikeCount(likeRows.count ?? 0);
      }

      // Load comments
      const { data: commentRows, error: commentErr } = await supabase
        .from("comments")
        .select("name, text, created_at")
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: true });

      if (commentErr) {
        console.error("[Supabase] comments fetch error:", commentErr.message);
      } else if (commentRows) {
        setComments(
          commentRows.map((c) => ({
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
      console.error("[Supabase] unexpected error:", err);
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
    const storageKey = `liked-${postSlug}`;
    const currentlyLiked = liked;
    const delta = currentlyLiked ? -1 : 1;

    setLiked(!currentlyLiked);
    setLikeCount((c) => Math.max(0, c + delta));
    localStorage.setItem(storageKey, currentlyLiked ? "" : "1");

    try {
      // Read current count from DB to stay accurate
      const { data: row } = await supabase
        .from("likes")
        .select("count")
        .eq("post_slug", postSlug)
        .maybeSingle();

      const currentCount = row?.count ?? 0;
      const newCount = Math.max(0, currentCount + delta);

      const { error: upsertErr } = await supabase.from("likes").upsert(
        {
          post_slug: postSlug,
          count: newCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "post_slug" },
      );

      if (upsertErr) {
        console.error("[Supabase] like upsert error:", upsertErr.message);
        // Revert optimistic update
        setLiked(currentlyLiked);
        setLikeCount((c) => Math.max(0, c - delta));
        localStorage.setItem(storageKey, currentlyLiked ? "1" : "");
      }
    } catch (err) {
      console.error("[Supabase] like unexpected error:", err);
      setLiked(currentlyLiked);
      setLikeCount((c) => Math.max(0, c - delta));
      localStorage.setItem(storageKey, currentlyLiked ? "1" : "");
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commenterName.trim()) return;

    setLoading(true);
    setError(null);

    const text = commentText.trim();
    const name = commenterName.trim();

    try {
      const { error: insertErr } = await supabase.from("comments").insert({
        post_slug: postSlug,
        name,
        text,
      });

      if (insertErr) {
        console.error("[Supabase] comment insert error:", insertErr.message);
        setError("Failed to post comment. Please try again.");
        setLoading(false);
        return;
      }

      // Reload comments from DB to confirm persistence
      await loadData();
      setCommentText("");
      setCommenterName("");
      setLoading(false);
    } catch (err) {
      console.error("[Supabase] comment unexpected error:", err);
      setError("Failed to post comment.");
      setLoading(false);
    }
  };

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
                  key={i}
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
