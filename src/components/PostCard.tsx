import Image from "next/image";
import Link from "next/link";

import { getBlurDataURL, resolveImageUrl } from "@/lib/image";
import type { PostPreview } from "@/lib/types";
import { formatShortDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostPreview }) {
  const imageSrc =
    resolveImageUrl(post.coverImage, {
      width: 800,
      height: 450,
      fit: "crop",
      quality: 82,
    }) ?? null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] transition-all duration-300 ease-out hover:border-[var(--border-medium)] hover:shadow-soft"
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-[var(--bg-secondary)]">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={post.coverImageAlt || post.title}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={getBlurDataURL()}
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#16242B_0%,#1D1F20_55%,#13241E_100%)]" />
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {/* Category Tag */}
        {post.category && (
          <span className="inline-flex items-center self-start rounded-full bg-[var(--accent-text-subtle)] px-2.5 py-1 font-ui text-[0.75rem] font-semibold uppercase tracking-widest text-[var(--accent-text)]">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h2 className="font-display text-[1.375rem] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--accent-text)]">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)] line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 border-t border-[var(--border-light)] pt-2 font-ui text-[0.8125rem] text-[var(--text-tertiary)]">
          <span>{formatShortDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  );
}
