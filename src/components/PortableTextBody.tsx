import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { PostImageWithLightbox } from "@/components/PostImageWithLightbox";
import { resolvePortableTextImageUrl } from "@/lib/image";
import type { PortableTextValue } from "@/lib/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-[1.125rem] leading-[1.9] tracking-[-0.003em] text-[var(--text-primary)] mb-7">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-display mt-14 text-[1.75rem] font-bold leading-[1.2] tracking-[-0.01em] text-[var(--text-primary)] mb-6">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-10 text-[1.375rem] font-semibold leading-[1.25] text-[var(--text-primary)] mb-4">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-[var(--accent-text)] pl-6 font-body text-[1.125rem] leading-[1.8] text-[var(--text-secondary)] italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-[var(--text-primary)]">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");

      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer noopener" : undefined}
          className="text-[var(--accent-text)] underline underline-offset-2 decoration-[var(--accent-text-subtle)] hover:decoration-[var(--accent-text)] transition-all"
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-none space-y-2 mb-7 ml-0">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-7 ml-0 marker:text-[var(--accent-text)] marker:font-semibold">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3 font-body text-[1.0625rem] leading-[1.8] text-[var(--text-primary)]">
        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent-text)]" />
        {children}
      </li>
    ),
  },
  types: {
    postImage: ({ value }) => {
      const src = resolvePortableTextImageUrl(value);

      if (!src) {
        return null;
      }

      const alt = typeof value.alt === "string" ? value.alt : "";
      const cap = typeof value.caption === "string" && value.caption ? value.caption : undefined;
      const rawLayout = value.layout;
      const layout =
        rawLayout === "wide" || rawLayout === "full" || rawLayout === "normal" ? rawLayout : "normal";
      const v = value as Record<string, unknown>;
      const imageWidth = typeof v.imageWidth === "number" ? v.imageWidth : undefined;
      const imageHeight = typeof v.imageHeight === "number" ? v.imageHeight : undefined;

      return (
        <PostImageWithLightbox
          src={src}
          alt={alt}
          caption={cap}
          layout={layout}
          width={imageWidth}
          height={imageHeight}
        />
      );
    },
    code: ({ value }) => (
      <div className="my-8 overflow-hidden rounded-xl bg-[var(--bg-inverse)] text-[var(--text-inverse)] shadow-[0_8px_32px_rgba(26,25,23,0.15)]">
        {value.filename ? (
          <div className="border-b border-[color:rgba(244,242,238,0.12)] px-6 py-3 font-mono text-[0.75rem] uppercase text-[color:rgba(244,242,238,0.6)]">
            {value.filename}
          </div>
        ) : null}
        <pre className="overflow-x-auto px-6 py-5 font-mono text-[0.9rem] leading-[1.7]">
          <code>{String(value.code || "")}</code>
        </pre>
      </div>
    ),
  },
};

export function PortableTextBody({ body }: { body: PortableTextValue }) {
  return <PortableText value={body} components={components} />;
}
