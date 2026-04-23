"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

export function PostActions() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<{ name: string; text: string; time: string }[]>([]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        name: "Reader",
        text: commentText.trim(),
        time: "Just now",
      },
    ]);
    setCommentText("");
  };

  return (
    <div className="mt-12 border-t border-[var(--border-light)] pt-8">
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
                disabled={!commentText.trim()}
                className="rounded-full bg-[var(--accent)] px-5 py-2 font-ui text-sm font-semibold text-[var(--accent-foreground)] transition-all duration-200 hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Post Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
