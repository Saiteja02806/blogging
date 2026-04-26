import Image from "next/image";

import { formatLongDate } from "@/lib/utils";

interface PostHeaderProps {
  title: string;
  category?: string;
  publishedAt: string;
  readTime: number;
  authorName?: string;
  authorImage?: string;
}

export function PostHeader({
  title,
  category,
  publishedAt,
  readTime,
  authorName,
  authorImage,
}: PostHeaderProps) {
  return (
    <div className="space-y-6">
      {category && (
        <span className="inline-flex items-center rounded-full bg-[var(--accent-text-subtle)] px-3 py-1 font-ui text-xs font-bold uppercase tracking-widest text-[var(--accent-text)]">
          {category}
        </span>
      )}

      <div className="space-y-5">
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[var(--text-primary)]">
          {title}
        </h1>

        <div className="flex items-center gap-4">
          {authorImage && (
            <div className="h-10 w-10 overflow-hidden rounded-full border border-[var(--border-light)]">
              <Image
                src={authorImage}
                alt={authorName || "Author"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            {authorName && (
              <span className="font-ui text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]">
                {authorName}
              </span>
            )}
            <div className="flex items-center gap-2 font-ui text-[0.8rem] text-[var(--text-tertiary)]">
              <time dateTime={publishedAt}>{formatLongDate(publishedAt)}</time>
              <span>·</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--border-light)]" />
    </div>
  );
}
