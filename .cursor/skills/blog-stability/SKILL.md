---
name: blog-stability
description: >-
  Build and maintain Next.js/Sanity blogs without image distortion, layout overflow,
  or blank/black screens. Use when writing blog posts, adding images, debugging
  empty UI, Portable Text blocks, next/image, or production build problems.
---

# Blog stability (images + no blank screen)

## Images (avoid repeated “image tickets”)

1. **One component** for in-post images (e.g. `BlogImage` + lightbox). Do not use raw `<img>` in article bodies.
2. **next/image** needs **width/height** (or `fill` + parent size). Use **real aspect ratio** from the asset; never force one global height for all images.
3. **Tall screenshots**: cap **max-height** in CSS (`min(65vh, 520px)` or similar) and use **`object-fit: contain`** so phone mocks do not fill the whole viewport.
4. **Sanity (or CMS)**: keep **alt** required; use **optional `imageWidth` / `imageHeight`** only as layout hints, not for cropping. Prefer **`layout: normal | wide | full`** instead of ad-hoc CSS per post.
5. **Files**: put assets under `public/` with **simple names** (e.g. `author-avatar.png`). Avoid long filenames and spaces in URLs.
6. **`next.config`**: add **`remotePatterns`** for any CDN (e.g. `cdn.sanity.io`) or local images break at runtime.
7. **Order blocks in the CMS** to match reading order: section heading → paragraphs → **then** the image for that section.

## Blank / black screen (end-to-end)

1. **Black + dark theme** = often the **page background** with **no visible text** (React error, failed chunk, or CSS not applied). Open **DevTools → Console** first.
2. **Stale build**: if you see missing `vendor-chunks` or random `MODULE_NOT_FOUND` under `.next`, run **`rd /s /q .next`** (Windows) or `rm -rf .next`, then `npm run build` again.
3. **CSS**: do not put `@import` for extra stylesheets **at the end** of a file that already has many rules; import them from **`layout.tsx`** after `globals.css` so the bundle order is valid.
4. **Fonts**: always set **system font fallbacks** in Tailwind `fontFamily` so text still renders if a Google font variable fails.
5. **Error UI**: keep **`app/error.tsx`** and **`app/global-error.tsx`** so users see a message instead of an empty shell.
6. **Deploy**: confirm **env vars** on the host (`NEXT_PUBLIC_SANITY_*`, etc.); a failing **fetch** during SSG can break the build or leave empty data.

## When the agent answers

The user may require **no unsolicited recap** of edits at the end of a turn. Confirm or answer the question; do not list “what I changed” unless they ask.
