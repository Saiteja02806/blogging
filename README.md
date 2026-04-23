# Personal Blog Platform

An editorial-style personal blog built with Next.js 14, Tailwind CSS, and Sanity.

## Stack

- Next.js 14 App Router
- Tailwind CSS
- Sanity CMS with Portable Text
- `next/image` for optimized editorial imagery

## Local Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Run the Sanity Studio:

```bash
npm run studio
```

## Environment Variables

Copy `.env.example` and fill in your Sanity project values:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
```

If those values are missing, the frontend falls back to local mock posts so the UI still renders and builds cleanly.

## Project Structure

```text
src/
  app/
    page.tsx
    about/page.tsx
    blog/[slug]/page.tsx
  components/
    Footer.tsx
    HomePostCollection.tsx
    Navbar.tsx
    PortableTextBody.tsx
    PostCard.tsx
    PostHeader.tsx
  lib/
    image.ts
    mock-data.ts
    sanity.ts
    site.ts
sanity/
  schemas/
    post.ts
sanity.config.ts
sanity.cli.ts
```

## Verification

```bash
npm run lint
npm run build
```

Both commands pass in the current workspace.
