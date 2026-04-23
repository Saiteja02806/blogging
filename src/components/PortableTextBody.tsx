import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

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

      return (
        <figure className="my-12 -mx-6 sm:mx-0 overflow-hidden rounded-xl shadow-soft">
          <div className="relative">
            <Image
              src={src}
              alt={typeof value.alt === "string" ? value.alt : ""}
              width={1200}
              height={675}
              className="h-auto w-full object-cover"
            />
          </div>
          {typeof value.caption === "string" && value.caption ? (
            <figcaption className="text-center font-ui text-sm text-[var(--text-tertiary)] mt-3 mb-1 italic">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
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
