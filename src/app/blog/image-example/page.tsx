import { BlogImage } from "@/components/blog/BlogImage";

/**
 * Example: code-based post using {@link BlogImage} with normal / wide / full layouts.
 * CMS posts use the same component via `PostImageWithLightbox` in PortableText.
 */
export default function BlogImageExamplePage() {
  return (
    <main className="article-content flex-1">
      <div className="mx-auto max-w-[680px] px-6 py-16">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-bold text-[var(--text-primary)]">
          Code-based blog images
        </h1>
        <p className="font-body mt-4 text-[1.125rem] leading-[1.9] text-[var(--text-primary)]">
          This page shows <code className="text-[var(--accent-text)]">BlogImage</code> with each layout. Replace
          paths with assets under <code className="text-[var(--accent-text)]">/public</code> when you add files.
        </p>

        <BlogImage
          src="/author-avatar.png"
          alt="Profile photo — normal width"
          width={800}
          height={800}
          layout="normal"
          fit="contain"
          caption="Normal — up to the text column width (28rem cap)."
        />

        <BlogImage
          src="/author-avatar.png"
          alt="Product screenshot — wide"
          width={1440}
          height={900}
          layout="wide"
          fit="contain"
          caption="Wide — up to 960px, breaks out of the text column."
        />

        <BlogImage
          src="/author-avatar.png"
          alt="Hero style — full width"
          width={1920}
          height={800}
          layout="full"
          fit="cover"
          caption="Full — edge to edge. Use for hero-style shots."
        />
      </div>
    </main>
  );
}
