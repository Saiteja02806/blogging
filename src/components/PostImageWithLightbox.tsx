"use client";

import { Eye, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";

import { BlogImage, type BlogImageLayout } from "@/components/blog/BlogImage";

type PostImageWithLightboxProps = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  layout?: BlogImageLayout;
};

const DEFAULT_W = 520;
const DEFAULT_H = 840;

export function PostImageWithLightbox({
  src,
  alt,
  caption,
  width = DEFAULT_W,
  height = DEFAULT_H,
  layout = "normal",
}: PostImageWithLightboxProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);
  const openLightbox = useCallback(() => setOpen(true), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <BlogImage
        src={src}
        alt={alt}
        caption={caption}
        width={width}
        height={height}
        layout={layout}
        fit="contain"
        onImageClick={openLightbox}
        frameActions={
          <button
            type="button"
            onClick={openLightbox}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-text)]/35 bg-[color:rgba(29,31,32,0.97)] text-[var(--accent-text)] shadow-lg ring-1 ring-inset ring-white/10 backdrop-blur-sm transition hover:border-[var(--accent-text)] hover:bg-[var(--accent-text)]/10 hover:brightness-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent-text)]"
            aria-label="View image full size"
          >
            <Eye className="h-4 w-4" strokeWidth={2.25} />
          </button>
        }
      />

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-zoom-out bg-[color:rgba(0,0,0,0.86)]"
            onClick={close}
            tabIndex={-1}
            aria-label="Close enlarged image"
          />
          <div className="relative z-10 flex max-h-[min(92vh,1200px)] w-full max-w-[min(96vw,1200px)] flex-col items-center">
            <p id={titleId} className="sr-only">
              {alt || "Enlarged image"}
            </p>
            <button
              type="button"
              onClick={close}
              className="mb-2 ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition hover:text-[var(--accent-text)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent-text)]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative w-full min-h-0 max-h-[85vh] flex-1">
              <Image
                src={src}
                alt={alt}
                width={1920}
                height={1920}
                sizes="(max-width: 1200px) 96vw, 1200px"
                className="max-h-[85vh] w-full object-contain"
                priority
                unoptimized={src.startsWith("data:")}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
