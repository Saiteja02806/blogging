import type { TypedObject } from "@portabletext/types";

export type BlogImage = string | Record<string, unknown> | null | undefined;

export type PortableTextValue = TypedObject[];

export interface PostPreview {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  publishedAt: string;
  excerpt: string;
  readTime: number;
  category?: string;
  coverImage?: BlogImage;
  coverImageAlt?: string;
}

export interface BlogPost extends PostPreview {
  body: PortableTextValue;
}
