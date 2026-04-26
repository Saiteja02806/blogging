import { defineArrayMember, defineField, defineType } from "sanity";

export const postImage = defineType({
  name: "postImage",
  title: "Post Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    defineField({
      name: "alt",
      title: "Alt Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "layout",
      title: "Image size",
      description: "Normal = text width, Wide = up to 960px, Full = full browser width (hero-style).",
      type: "string",
      options: {
        list: [
          { title: "Normal (text width)", value: "normal" },
          { title: "Wide (screenshots, mockups)", value: "wide" },
          { title: "Full (edge to edge)", value: "full" },
        ],
        layout: "radio",
        direction: "vertical",
      },
      initialValue: "normal",
    }),
    defineField({
      name: "imageWidth",
      title: "Display width (px)",
      type: "number",
      description: "Optional. Hint for layout (e.g. 260 for a half-width phone shot).",
    }),
    defineField({
      name: "imageHeight",
      title: "Display height (px)",
      type: "number",
    }),
  ],
});

export const post = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short description shown on the home page card.",
      validation: (rule) => rule.required().max(240),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readTime",
      title: "Read Time (minutes)",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: ["AI Trends", "Agents", "Workflow", "Perspective"],
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "postImage" }),
        defineArrayMember({ type: "code" }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
