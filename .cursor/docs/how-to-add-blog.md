# How to Add a Blog Post (Mock Data)

## Prerequisites

1. **Cover image**: Place in `public/` with a clean filename (e.g. `my-post-cover.png`)
2. **In-body images** (optional): Also in `public/` (e.g. `step1-screenshot.png`)

## Steps

### 1. Open `src/lib/mock-data.ts`

### 2. Add your post object to `mockPostsInternal` array

Insert at the **top** of the array (before existing posts) so it appears first chronologically:

```ts
const mockPostsInternal: BlogPost[] = [
  {
    _id: "your-post-slug",  // Unique ID (kebab-case)
    title: "Your Post Title",
    slug: { current: "your-post-slug" },  // URL-friendly slug
    publishedAt: "2026-04-26T16:00:00.000Z",  // ISO 8601 timestamp
    excerpt: "Short description (1-2 sentences, max ~240 chars)",
    readTime: 6,  // Estimated reading time in minutes
    category: "Product Analysis",  // Or: AI Trends, Agents, Workflow, Perspective
    coverImage: "/your-cover-image.png",  // Path from public/
    coverImageAlt: "Descriptive alt text",
    body: [
      // Body blocks go here (see below)
    ],
  },
  // ... existing posts
];
```

### 3. Build the `body` array

Use these helper functions:

#### Text blocks

```ts
paragraph("Your paragraph text here."),
```

#### Headings

```ts
heading("Section Title", "h2"),  // Main section
heading("Subsection", "h3"),     // Subsection
```

#### Images (in-body)

```ts
postImage(
  "/image-filename.png",  // From public/
  "Alt text",
  "Caption text (optional)",
  {
    layout: "normal",  // or "wide" or "full"
    imageWidth: 520,   // Optional: display hint (px)
    imageHeight: 840,  // Optional: display hint (px)
  }
),
```

**Layout options:**
- `"normal"`: Fits text column width (~28rem max)
- `"wide"`: Wider frame (~60rem max, good for screenshots)
- `"full"`: Edge-to-edge (hero style)

**Image sizing:**
- If `imageWidth ≤ 320`, figure uses `.blog-image-compact` class (tighter cap)
- For tall phone screenshots, CSS caps max-height at `min(65vh, 520px)` with `object-fit: contain`

### 4. Order matters

Place images **after** the section text they illustrate:

```ts
heading("Step 1: The Problem", "h2"),
paragraph("Explanation of the problem..."),
paragraph("More detail..."),
postImage("/step1-screenshot.png", "Screenshot", "Caption"),  // Image after text

heading("Step 2: The Solution", "h2"),
paragraph("How to solve it..."),
postImage("/step2-screenshot.png", "Screenshot", "Caption"),  // Image after text
```

### 5. Save and verify

1. **Build**: `npm run build`
2. **Dev**: `npm run dev`
3. Navigate to `/blog/your-post-slug`
4. Check:
   - Cover image appears on home page card and at top of post (if page layout includes it)
   - In-body images are positioned correctly after their sections
   - Images have correct aspect ratios (no squashing)
   - Eye icon appears top-right on each image
   - Clicking opens lightbox with full-size view

### 6. Commit

```bash
git add public/your-cover-image.png public/other-images.png src/lib/mock-data.ts
git commit -m "Add blog: Your Post Title"
git push origin main
```

## Common issues

1. **Cover image not showing**: Verify filename matches `coverImage` path exactly (case-sensitive)
2. **Image too small/large**: Adjust `imageWidth`/`imageHeight` or use different `layout`
3. **Image squashed**: Ensure width/height match real asset aspect ratio
4. **Post not appearing**: Check `publishedAt` timestamp is valid ISO 8601
5. **Black screen after deploy**: Delete `.next` folder, rebuild (`npm run build`)

## Sanity CMS (when configured)

For production with Sanity Studio:
1. Open Studio at `/studio` route
2. Create new "Blog Post" document
3. Fill title, slug, excerpt, read time, category
4. Upload cover image via image field
5. Add body blocks:
   - Text: Normal paragraph
   - Headings: H2 or H3 block
   - Images: "Post Image" block with alt, caption, layout
6. Publish

The app uses mock data as fallback when `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set.
