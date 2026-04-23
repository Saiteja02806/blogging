import { cache } from "react";
import { createClient, groq } from "next-sanity";

import { getMockPostBySlug, getMockPreviews } from "@/lib/mock-data";
import type { BlogPost, PostPreview } from "@/lib/types";

const apiVersion = "2024-01-01";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const revalidate = 3600;

export const isSanityConfigured = Boolean(projectId && dataset);

export const client = createClient({
  apiVersion,
  dataset,
  projectId: projectId || "demo-project",
  useCdn: true,
});

const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    readTime,
    category,
    coverImage,
    "coverImageAlt": coverImage.alt
  }
`;

const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    readTime,
    category,
    coverImage,
    "coverImageAlt": coverImage.alt,
    body[]{
      ...,
      _type == "postImage" => {
        ...,
        "assetUrl": asset->url
      }
    }
  }
`;

const allSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][]{
    "slug": slug.current
  }
`;

export const getAllPosts = cache(async (): Promise<PostPreview[]> => {
  if (!isSanityConfigured) {
    return [];
  }

  try {
    return await client.fetch<PostPreview[]>(
      allPostsQuery,
      {},
      { next: { revalidate } },
    );
  } catch {
    return [];
  }
});

export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  if (!isSanityConfigured) {
    return [];
  }

  try {
    const rows = await client.fetch<Array<{ slug: string }>>(
      allSlugsQuery,
      {},
      { next: { revalidate } },
    );

    return rows.map((row) => row.slug);
  } catch {
    return [];
  }
});

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!isSanityConfigured) {
      return null;
    }

    try {
      const post = await client.fetch<BlogPost | null>(
        postBySlugQuery,
        { slug },
        { next: { revalidate } },
      );

      return post ?? null;
    } catch {
      return null;
    }
  },
);
