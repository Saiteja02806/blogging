import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostActions } from "@/components/PostActions";
import { PortableTextBody } from "@/components/PortableTextBody";
import { PostHeader } from "@/components/PostHeader";
import { resolveImageUrl } from "@/lib/image";
import { getAllPostSlugs, getPostBySlug } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const image = resolveImageUrl(post.coverImage, {
    width: 1200,
    height: 630,
    fit: "crop",
  });

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: image
      ? {
          title: `${post.title} | ${siteConfig.name}`,
          description: post.excerpt,
          images: [{ url: image }],
        }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="flex-1">
      <article>
        {/* Post Header */}
        <section className="mx-auto max-w-[680px] px-6 pb-8 pt-16">
          {/* Back Link */}
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-ui text-sm text-[var(--text-tertiary)] transition-colors hover:text-[var(--accent-text)] group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            All Posts
          </Link>

          <PostHeader
            title={post.title}
            category={post.category}
            publishedAt={post.publishedAt}
            readTime={post.readTime}
            authorName={siteConfig.author.name}
            authorImage={siteConfig.author.image}
          />
        </section>

        {/* Post Body — reading column */}
        <div className="mx-auto max-w-[680px] px-6 pb-24">
          <PortableTextBody body={post.body} />

          {/* Like + Comment Actions */}
          <PostActions />

          {/* Bottom divider + back link */}
          <div className="mt-16 border-t border-[var(--border-light)] pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-ui text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-text)] group"
            >
              <span className="transition-transform group-hover:-translate-x-1">←</span>
              Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
