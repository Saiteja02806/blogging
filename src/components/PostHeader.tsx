import Image from "next/image";

import { formatPostHeaderDate } from "@/lib/utils";

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

        <div className="flex items-center gap-3.5">
          {authorImage ? (
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border-light)] ring-1 ring-inset ring-white/5">
              <Image
                src={authorImage}
                alt={authorName || "Author"}
                width={48}
                height={48}
                className="h-full w-full object-cover"
                sizes="48px"
                priority
              />
            </div>
          ) : null}
          <div className="flex min-w-0 flex-col justify-center gap-0.5">
            {authorName ? (
              <span className="font-ui text-[0.8125rem] font-bold uppercase leading-tight tracking-[0.1em] text-[var(--text-primary)]">
                {authorName}
              </span>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-1.5 font-ui text-[0.7rem] font-medium uppercase leading-tight tracking-[0.06em] text-[var(--text-tertiary)]">
              <time dateTime={publishedAt}>{formatPostHeaderDate(publishedAt)}</time>
              <span className="text-[var(--text-tertiary)]/80" aria-hidden>
                ·
              </span>
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--border-light)]" />
    </div>
  );
}
