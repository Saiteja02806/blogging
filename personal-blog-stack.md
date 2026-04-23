# 📖 Personal Blog Platform — Complete Stack & UI Guide
> A Substack-inspired personal blogging system. Read-only for visitors. You publish, they read. No auth. No payments. Just clean editorial design and great writing.

---

## 🧭 What This Is

A two-screen application:

| Screen | Description |
|--------|-------------|
| **Home** | Grid of all your published blog posts — cover image, title, excerpt, date, read time |
| **Blog Post** | Full single-post reading experience — title, cover, rich body content with images |

That's it. Dead simple architecture. Maximum reading experience.

---

## 🏗️ THE STACK

---

### 1. 🖥️ Framework — Next.js 14 (App Router)

**What it is:** React-based full-stack framework.

**Why this specifically:**

- **Static Site Generation (SSG)** — every blog post page pre-renders to pure HTML at build time. When a reader opens your post, they get a file, not a computation. This is why Substack loads instantly.
- **`next/image`** — built-in image component that auto-resizes, converts to WebP, lazy-loads, and prevents layout shift. Handles your image-heavy posts natively.
- **App Router** — file-based routing. Your `/blog/[slug]` route just works — create a folder, get a page.
- **API Routes** — you don't need a separate Express server. `app/api/` handles any server logic inside the same project.
- **Zero-config deployment** to Vercel.

**Install:**
```bash
npx create-next-app@latest my-blog \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

---

### 2. 🎨 Styling — Tailwind CSS + shadcn/ui

**Tailwind CSS** — utility-first CSS. Instead of writing stylesheet files, you compose classes directly in JSX. This is how you get Substack's editorial precision: `text-[1.125rem] leading-[1.9] tracking-[-0.003em]` — exact typographic control with zero CSS files.

**shadcn/ui** — copy-paste component library built on Radix + Tailwind. You own every component file. Use it for:
- `Card` — blog post cards on homepage
- `Badge` — category/tag labels
- `Separator` — section dividers
- `Skeleton` — loading states

```bash
npx shadcn@latest init
npx shadcn@latest add card badge separator skeleton
```

---

### 3. 📝 Content CMS — Sanity (with Portable Text)

**What it is:** A headless CMS with a beautiful visual editor (`yourdomain.sanity.studio`).

**Why Sanity over everything else:**

| Feature | Why it matters for your blog |
|---------|-------------------------------|
| **Visual rich editor** | Drag images, bold text, add headings, embed code blocks — exactly like Substack's editor |
| **Image uploads with hotspot** | Upload images directly in the editor. Sanity stores them and serves via its own CDN |
| **Portable Text** | Their rich-text format serializes to any frontend. Your blog post body becomes structured JSON you render however you want |
| **Free tier** | Covers personal projects generously (3 users, 10GB bandwidth, 100K API requests/month) |
| **GROQ query language** | Simpler than GraphQL for fetching posts |

**Your content schema** (the shape of a blog post):

```typescript
// sanity/schemas/post.ts
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At'
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      description: 'Short description shown on the home page card'
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Cover Image',
      options: { hotspot: true }
    },
    {
      name: 'readTime',
      type: 'number',
      title: 'Read Time (minutes)'
    },
    {
      name: 'category',
      type: 'string',
      title: 'Category'
    },
    {
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [
        { type: 'block' },           // rich text paragraphs
        { type: 'image' },           // inline images in the post
        {
          type: 'code',              // code blocks
          options: { withFilename: true }
        }
      ]
    }
  ]
}
```

**Install Sanity into your Next.js project:**
```bash
npm install next-sanity @sanity/image-url @portabletext/react
npx sanity@latest init --env
```

**Fetching posts (GROQ query):**
```typescript
// lib/sanity.ts
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

// Get all posts for homepage
export const getAllPosts = async () => {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      readTime,
      category,
      coverImage
    }
  `)
}

// Get single post by slug
export const getPostBySlug = async (slug: string) => {
  return client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      publishedAt,
      readTime,
      category,
      coverImage,
      body
    }
  `, { slug })
}
```

---

### 4. 🗄️ Database — None Needed

You don't need a separate database. Here's why:

Sanity **is** your database for content. It stores:
- All your blog posts
- All images (in Sanity's own CDN)
- All metadata (dates, slugs, categories)

You're not storing user data, comments, sessions, or subscriptions. The only data is your own content — and that lives in Sanity. This is the right call for your use case.

> **If you ever add comments later:** Use **Giscus** (GitHub Discussions-based, zero backend required) or plug in **Supabase** at that point.

---

### 5. 🖼️ Images — Sanity CDN + `next/image`

This is the critical piece that makes image-heavy posts work beautifully.

**How it flows:**

```
You upload image in Sanity editor
        ↓
Sanity stores it at cdn.sanity.io
        ↓
Your Next.js frontend requests it via @sanity/image-url builder
        ↓
Sanity CDN serves it resized/optimized for the user's screen
        ↓
next/image adds lazy-loading, blur placeholder, WebP conversion
```

**The image URL builder:**

```typescript
import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

// Usage examples:
urlFor(post.coverImage).width(800).height(450).fit('crop').url()
// → https://cdn.sanity.io/images/.../800x450.webp

urlFor(post.coverImage).width(400).quality(80).auto('format').url()
// → Auto WebP, 80% quality, 400px wide
```

**Rendering cover image with Next.js:**

```tsx
import Image from 'next/image'
import { urlFor } from '@/lib/image'

<Image
  src={urlFor(post.coverImage).width(1200).height(630).fit('crop').url()}
  alt={post.title}
  width={1200}
  height={630}
  priority          // above-fold images load immediately
  className="w-full h-full object-cover"
  placeholder="blur"
  blurDataURL={urlFor(post.coverImage).width(20).quality(20).url()}
/>
```

**Add Sanity CDN to next.config:**

```javascript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}
```

No Cloudinary needed. Sanity's CDN handles everything for a personal blog at this scale.

---

### 6. ☁️ Hosting — Vercel

**Why Vercel:**

- Zero-config Next.js deployment (they built Next.js)
- Push to GitHub → auto-deploy in 30 seconds
- Global Edge CDN — your pre-rendered HTML and images are served from the closest node to each reader
- Free tier: 100GB bandwidth, unlimited personal projects, custom domains, HTTPS
- Preview deployments on every git branch

**Deploy:**
```bash
npm install -g vercel
vercel
# Follow prompts → connected to GitHub → done
```

**Environment variables in Vercel dashboard:**
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_token
```

---

## 📁 Project Structure

```
my-blog/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout (navbar, footer)
│   │   ├── page.tsx            ← Home screen (blog list)
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    ← Single blog post screen
│   │   └── globals.css
│   ├── components/
│   │   ├── PostCard.tsx        ← Card on homepage grid
│   │   ├── PostHeader.tsx      ← Title + meta on post page
│   │   ├── PortableTextBody.tsx ← Rich text renderer
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── lib/
│       ├── sanity.ts           ← Sanity client + queries
│       └── image.ts            ← Image URL builder
├── sanity/
│   └── schemas/
│       └── post.ts             ← Content schema
├── sanity.config.ts
├── next.config.js
└── tailwind.config.ts
```

---

## 🎨 UI & COLOR SYSTEM

### Design Philosophy

The aesthetic is **refined editorial** — think long-form journalism, not a dashboard. High contrast. Generous whitespace. Typography-first. Every design decision serves the reading experience.

Primary inspiration: Substack's reader experience, but made more personal and distinctive with your own voice through typography and color.

---

### Color Palette

```css
/* globals.css — CSS custom properties */
:root {

  /* ── BACKGROUNDS ─────────────────────────────── */
  --bg-primary:      #FAFAF8;   /* Warm off-white — easier on eyes than pure white */
  --bg-secondary:    #F4F2EE;   /* Slightly warmer — used for card hovers, code blocks */
  --bg-inverse:      #1A1917;   /* Near-black — footer, dark sections */

  /* ── TEXT ────────────────────────────────────── */
  --text-primary:    #1A1917;   /* Near-black — body text, headings */
  --text-secondary:  #6B6860;   /* Warm gray — dates, read time, metadata */
  --text-tertiary:   #9E9B94;   /* Light gray — placeholder text, disabled states */
  --text-inverse:    #F4F2EE;   /* Light text on dark backgrounds */

  /* ── ACCENT ──────────────────────────────────── */
  --accent:          #E8612A;   /* Warm orange — your brand color, CTAs, links */
  --accent-hover:    #D04E1B;   /* Darker on hover */
  --accent-subtle:   #FDF0E8;   /* Very light orange tint — tag backgrounds */

  /* ── BORDERS ─────────────────────────────────── */
  --border-light:    #E8E5DF;   /* Subtle separators */
  --border-medium:   #D4D0C8;   /* Card borders, dividers */

  /* ── TYPOGRAPHY SCALE ────────────────────────── */
  --font-display:    'Playfair Display', Georgia, serif;   /* Headings */
  --font-body:       'Source Serif 4', Georgia, serif;     /* Body text */
  --font-mono:       'JetBrains Mono', 'Fira Code', monospace; /* Code */
  --font-ui:         'DM Sans', system-ui, sans-serif;     /* Nav, labels, UI elements */

}
```

> **Color logic:** The warm off-white (`#FAFAF8`) vs pure white (`#FFFFFF`) is not a minor choice — it's what separates premium editorial from generic SaaS. Substack uses this same warm-paper feel. The orange accent gives you identity and warmth without being aggressive.

---

### Typography System

```css
/* Typography */

/* Display — hero titles, post titles on homepage */
.text-display-xl {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Post title — on the full post page */
.text-display-lg {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.015em;
}

/* Card title — on homepage post cards */
.text-card-title {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

/* Body text — inside a blog post */
.text-body {
  font-family: var(--font-body);
  font-size: 1.125rem;         /* 18px — Substack uses this exact size */
  line-height: 1.9;            /* Generous leading for reading comfort */
  letter-spacing: -0.003em;
}

/* Excerpt text — card description on homepage */
.text-excerpt {
  font-family: var(--font-ui);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Meta text — dates, read time, categories */
.text-meta {
  font-family: var(--font-ui);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

**Load fonts in layout.tsx:**
```typescript
import { Playfair_Display, Source_Serif_4, DM_Sans } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '600'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
})
```

---

## 📱 SCREEN DESIGNS

---

### SCREEN 1 — Home Page (Blog List)

**Layout:** Full-width, centered content column (max 1200px), responsive grid.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
│  [Your Name]                          Writing  About      │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│           HERO SECTION                                    │
│     ╔═══════════════════════════════╗                    │
│     ║  Writing about things that    ║                    │
│     ║  matter.                      ║                    │
│     ║  [Warm subheading text]       ║                    │
│     ╚═══════════════════════════════╝                    │
│                                                           │
│  ── ALL POSTS ──────────────────── [Filter by category]  │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ [COVER IMAGE]    │  │ [COVER IMAGE]    │             │
│  │ 16:9 ratio       │  │ 16:9 ratio       │             │
│  │──────────────────│  │──────────────────│             │
│  │ CATEGORY TAG     │  │ CATEGORY TAG     │             │
│  │ Post Title That  │  │ Another Great    │             │
│  │ Is Interesting   │  │ Blog Post Title  │             │
│  │                  │  │                  │             │
│  │ Short excerpt    │  │ Short excerpt    │             │
│  │ text...          │  │ text...          │             │
│  │                  │  │                  │             │
│  │ Apr 22 · 5 min   │  │ Apr 15 · 8 min   │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │ [COVER IMAGE]    │  │ [COVER IMAGE]    │             │
│  │ ...              │  │ ...              │             │
│  └──────────────────┘  └──────────────────┘             │
│                                                           │
│  FOOTER                                                   │
└─────────────────────────────────────────────────────────┘
```

**PostCard Component:**

```tsx
// components/PostCard.tsx
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/image'
import { formatDate } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt: string
  readTime: number
  category: string
  coverImage: any
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col bg-[var(--bg-primary)] border border-[var(--border-light)]
                 rounded-2xl overflow-hidden
                 hover:border-[var(--border-medium)] hover:shadow-[0_8px_32px_rgba(26,25,23,0.08)]
                 transition-all duration-300 ease-out"
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-[var(--bg-secondary)]">
        {post.coverImage ? (
          <Image
            src={urlFor(post.coverImage).width(800).height(450).fit('crop').url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 ease-out
                       group-hover:scale-[1.03]"
            placeholder="blur"
            blurDataURL={urlFor(post.coverImage).width(20).quality(20).url()}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-subtle)] to-[var(--bg-secondary)]" />
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-3 p-6 flex-1">
        {/* Category Tag */}
        {post.category && (
          <span className="inline-flex items-center self-start px-2.5 py-1
                           bg-[var(--accent-subtle)] text-[var(--accent)]
                           text-[0.75rem] font-semibold tracking-widest uppercase
                           rounded-full font-[var(--font-ui)]">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h2 className="font-[var(--font-display)] text-[1.375rem] font-semibold
                       leading-[1.3] tracking-[-0.01em] text-[var(--text-primary)]
                       group-hover:text-[var(--accent)] transition-colors duration-200">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="font-[var(--font-ui)] text-[0.9375rem] leading-[1.6]
                      text-[var(--text-secondary)] line-clamp-2 flex-1">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-light)]
                        font-[var(--font-ui)] text-[0.8125rem] text-[var(--text-tertiary)]">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>
      </div>
    </Link>
  )
}
```

**Homepage Layout:**

```tsx
// app/page.tsx
import { getAllPosts } from '@/lib/sanity'
import { PostCard } from '@/components/PostCard'

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-16">
        <div className="max-w-2xl">
          <p className="font-[var(--font-ui)] text-[var(--accent)] text-sm font-semibold
                        tracking-widest uppercase mb-4">
            Personal Blog
          </p>
          <h1 className="font-[var(--font-display)] text-[clamp(2.5rem,5vw,4rem)]
                         font-bold leading-[1.1] tracking-[-0.02em]
                         text-[var(--text-primary)] mb-6">
            Writing about things<br />that actually matter.
          </h1>
          <p className="font-[var(--font-ui)] text-[1.125rem] leading-[1.7]
                        text-[var(--text-secondary)] max-w-xl">
            Thoughts, essays, and notes on design, technology, and the craft of building things.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="h-px bg-[var(--border-light)]" />
      </div>

      {/* Posts Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-[var(--font-ui)] text-sm font-semibold
                         tracking-widest uppercase text-[var(--text-tertiary)]">
            All Posts — {posts.length}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

    </main>
  )
}
```

---

### SCREEN 2 — Single Blog Post Page

**Layout:** Narrow centered reading column (max 680px for body text). Classic editorial.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
│  [Your Name]                          ← Back to all posts │
│  ─────────────────────────────────────────────────────   │
│                                                           │
│        CATEGORY TAG                                       │
│                                                           │
│        The Full Title of This                             │
│        Blog Post Goes Here                                │
│                                                           │
│        Apr 22, 2026  ·  8 min read                       │
│        ─────────────────────────                         │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                                                   │  │
│  │           [FULL WIDTH COVER IMAGE]                │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│        The first paragraph of your blog post              │
│        begins here. The reading column is                 │
│        constrained to 680px for optimal line              │
│        length (65–75 characters). This is the             │
│        same constraint Substack uses.                     │
│                                                           │
│        Second paragraph. Body text is set in              │
│        Source Serif 4 at 18px with 1.9 line               │
│        height — comfortable for long reads.               │
│                                                           │
│        ## A Section Heading                               │
│                                                           │
│        More content below the heading...                  │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │        [INLINE IMAGE IN POST BODY]                │  │
│  │        Caption text below image                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                           │
│        Continuing prose...                                │
│                                                           │
│        ─────────────────────────────────────────────     │
│        ← Back to All Posts                               │
│                                                           │
│  FOOTER                                                   │
└─────────────────────────────────────────────────────────┘
```

**Blog Post Page:**

```tsx
// app/blog/[slug]/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import { urlFor } from '@/lib/image'
import { PortableTextBody } from '@/components/PortableTextBody'
import { formatDate } from '@/lib/utils'

// Generate static pages for every post at build time
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({ slug: post.slug.current }))
}

export default async function BlogPostPage({
  params
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">

      {/* Post Header */}
      <article className="max-w-[680px] mx-auto px-6 pt-16 pb-8">

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-[var(--font-ui)]
                     text-sm text-[var(--text-tertiary)] hover:text-[var(--accent)]
                     transition-colors mb-10 group"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          All Posts
        </Link>

        {/* Category */}
        {post.category && (
          <span className="inline-flex items-center px-3 py-1 mb-6
                           bg-[var(--accent-subtle)] text-[var(--accent)]
                           text-xs font-bold tracking-widest uppercase
                           rounded-full font-[var(--font-ui)]">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="font-[var(--font-display)] text-[clamp(2rem,4vw,3rem)]
                       font-bold leading-[1.15] tracking-[-0.015em]
                       text-[var(--text-primary)] mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[0.875rem]
                        text-[var(--text-tertiary)] font-[var(--font-ui)] mb-10">
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt)}
          </time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-light)] mb-10" />
      </article>

      {/* Cover Image — full bleed */}
      {post.coverImage && (
        <div className="max-w-[900px] mx-auto px-6 mb-14">
          <div className="relative aspect-video rounded-2xl overflow-hidden
                          shadow-[0_24px_64px_rgba(26,25,23,0.12)]">
            <Image
              src={urlFor(post.coverImage).width(1800).height(1012).fit('crop').url()}
              alt={post.title}
              fill
              priority
              className="object-cover"
              placeholder="blur"
              blurDataURL={urlFor(post.coverImage).width(20).quality(20).url()}
            />
          </div>
        </div>
      )}

      {/* Post Body — reading column */}
      <div className="max-w-[680px] mx-auto px-6 pb-24">
        <PortableTextBody body={post.body} />

        {/* Bottom divider + back link */}
        <div className="mt-16 pt-8 border-t border-[var(--border-light)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[var(--font-ui)]
                       text-sm font-medium text-[var(--text-secondary)]
                       hover:text-[var(--accent)] transition-colors group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to all posts
          </Link>
        </div>
      </div>

    </main>
  )
}
```

---

### Portable Text Renderer (Rich Body Content)

This is what converts Sanity's structured body JSON into styled HTML:

```tsx
// components/PortableTextBody.tsx
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'

const components = {
  block: {
    normal: ({ children }: any) => (
      <p className="font-[var(--font-body)] text-[1.125rem] leading-[1.9]
                    tracking-[-0.003em] text-[var(--text-primary)] mb-7">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-[var(--font-display)] text-[1.75rem] font-bold
                     leading-[1.2] tracking-[-0.01em] text-[var(--text-primary)]
                     mt-14 mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-[var(--font-display)] text-[1.375rem] font-semibold
                     leading-[1.25] text-[var(--text-primary)] mt-10 mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[var(--accent)] pl-6 my-8
                             font-[var(--font-body)] text-[1.125rem] leading-[1.8]
                             text-[var(--text-secondary)] italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-bold text-[var(--text-primary)]">{children}</strong>
    ),
    em: ({ children }: any) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--accent)] underline underline-offset-2
                   decoration-[var(--accent-subtle)] hover:decoration-[var(--accent)]
                   transition-all"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-none space-y-2 mb-7 ml-0">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-7 ml-0 marker:text-[var(--accent)]
                     marker:font-semibold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="flex gap-3 font-[var(--font-body)] text-[1.0625rem]
                     leading-[1.8] text-[var(--text-primary)]">
        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]
                         flex-shrink-0" />
        {children}
      </li>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <figure className="my-12 -mx-6 sm:mx-0 sm:rounded-xl overflow-hidden
                         shadow-[0_8px_32px_rgba(26,25,23,0.1)]">
        <div className="relative">
          <Image
            src={urlFor(value).width(1200).auto('format').url()}
            alt={value.alt || ''}
            width={1200}
            height={675}
            className="w-full h-auto"
          />
        </div>
        {value.caption && (
          <figcaption className="text-center text-sm text-[var(--text-tertiary)]
                                 font-[var(--font-ui)] mt-3 mb-1 italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
    code: ({ value }: any) => (
      <pre className="bg-[var(--bg-inverse)] text-[var(--text-inverse)]
                      rounded-xl px-6 py-5 my-8 overflow-x-auto
                      font-[var(--font-mono)] text-[0.9rem] leading-[1.7]
                      shadow-[0_8px_32px_rgba(26,25,23,0.15)]">
        <code>{value.code}</code>
      </pre>
    ),
  },
}

export function PortableTextBody({ body }: { body: any[] }) {
  return <PortableText value={body} components={components} />
}
```

---

### Navbar Component

```tsx
// components/Navbar.tsx
import Link from 'next/link'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)]/90
                       backdrop-blur-md border-b border-[var(--border-light)]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo / Name */}
        <Link
          href="/"
          className="font-[var(--font-display)] text-xl font-bold
                     text-[var(--text-primary)] hover:text-[var(--accent)]
                     transition-colors"
        >
          Your Name
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="font-[var(--font-ui)] text-sm text-[var(--text-secondary)]
                       hover:text-[var(--text-primary)] transition-colors"
          >
            Writing
          </Link>
          <Link
            href="/about"
            className="font-[var(--font-ui)] text-sm text-[var(--text-secondary)]
                       hover:text-[var(--text-primary)] transition-colors"
          >
            About
          </Link>
        </nav>

      </div>
    </header>
  )
}
```

---

### Footer Component

```tsx
// components/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-[var(--bg-inverse)] py-12 mt-0">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row
                      items-center justify-between gap-4">
        <p className="font-[var(--font-display)] text-lg font-semibold
                      text-[var(--text-inverse)]">
          Your Name
        </p>
        <p className="font-[var(--font-ui)] text-sm text-[var(--text-tertiary)]">
          © {new Date().getFullYear()} — Writing about things that matter
        </p>
      </div>
    </footer>
  )
}
```

---

## 🔄 Data Flow Summary

```
┌──────────────────────────────────────────────────────────┐
│                    CONTENT CREATION                       │
│                                                           │
│  You write at:  yourdomain.sanity.studio                 │
│  → Rich editor (like Substack's editor)                  │
│  → Upload images directly                                │
│  → Hit Publish                                           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓ Sanity stores post + images
                       │ to cdn.sanity.io
                       │
┌──────────────────────▼───────────────────────────────────┐
│                    BUILD TIME (Vercel)                    │
│                                                           │
│  Next.js calls getPostBySlug() for every post            │
│  → Renders each post as static HTML                      │
│  → Sends pre-built pages to Vercel Edge CDN              │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓ Reader opens your blog
                       │
┌──────────────────────▼───────────────────────────────────┐
│                    READER EXPERIENCE                      │
│                                                           │
│  Vercel edge serves pre-built HTML instantly             │
│  → Images served from Sanity CDN (auto-resized)         │
│  → next/image adds lazy-load + blur placeholder         │
│  → Reader sees post in ~150ms from anywhere on Earth    │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Package.json Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next-sanity": "^9.0.0",
    "@sanity/image-url": "^1.0.2",
    "@portabletext/react": "^3.1.0",
    "sanity": "^3.40.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  }
}
```

---

## 🚀 Setup Checklist

```
□ 1. Create Next.js project with TypeScript + Tailwind
□ 2. Run: npx sanity@latest init  → get project ID
□ 3. Define post schema in sanity/schemas/post.ts
□ 4. Configure CSS variables in globals.css
□ 5. Install Google Fonts via next/font (Playfair Display, Source Serif 4, DM Sans)
□ 6. Build PostCard component
□ 7. Build PortableTextBody component
□ 8. Build Navbar + Footer
□ 9. Wire up app/page.tsx (homepage)
□ 10. Wire up app/blog/[slug]/page.tsx (post page)
□ 11. Add cdn.sanity.io to next.config.js remotePatterns
□ 12. Push to GitHub
□ 13. Connect repo to Vercel → auto-deploy
□ 14. Add custom domain in Vercel dashboard
□ 15. Write your first post in Sanity Studio
```

---

## 💡 Key Design Decisions Explained

| Decision | Why |
|----------|-----|
| **Warm off-white `#FAFAF8` background** | Reduces eye strain vs pure white. The "warm paper" feel that editorial sites use. |
| **Max 680px reading column** | Optimal line length for reading (65–75 chars). The exact constraint Substack, Medium, and every editorial site uses. |
| **Source Serif 4 for body** | Serif fonts are scientifically easier to read for long-form text. Better than sans-serif for blog posts. |
| **Playfair Display for headings** | Creates strong typographic contrast with the body. Feels premium and editorial. |
| **1.9 line-height on body text** | More generous than typical (1.5–1.6). Makes long reads feel less dense and more comfortable. |
| **Cover image full-bleed on post page** | Max-width 900px vs 680px for text — visual hierarchy that lets images breathe without stretching the reading column. |
| **No database** | Sanity is your database. Adding PostgreSQL/Supabase for content that doesn't need a relational store is unnecessary complexity. |
| **`generateStaticParams`** | Every post is pre-rendered at build time. When you publish a new post, Vercel rebuilds only that page (Incremental Static Regeneration). |
```
