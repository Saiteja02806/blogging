import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

export type BlogImageLayout = "normal" | "wide" | "full";
export type BlogImageFit = "contain" | "cover";

type BlogImageProps = {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
  layout?: BlogImageLayout;
  fit?: BlogImageFit;
  priority?: boolean;
  /** e.g. eye / controls — shown top-right inside the frame */
  frameActions?: ReactNode;
  /** when set, the preview image opens zoom / lightbox (cursor zoom-in) */
  onImageClick?: () => void;
  className?: string;
};

export function BlogImage({
  src,
  alt,
  caption,
  width,
  height,
  layout = "normal",
  fit = "contain",
  priority = false,
  frameActions,
  onImageClick,
  className = "",
}: BlogImageProps) {
  const layoutClass: BlogImageLayout = layout;
  const compact = width <= 320;
  const figureClass = [
    "blog-image",
    `blog-image-${layoutClass}`,
    `blog-image-fit-${fit}`,
    compact ? "blog-image-compact" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sizes =
    layout === "full"
      ? "100vw"
      : compact
        ? `(max-width: 720px) 100vw, ${width}px`
        : layout === "wide"
          ? "(max-width: 1000px) 100vw, 960px"
          : "(max-width: 720px) 100vw, 28rem";

  const style = {
    "--image-ratio": `${width} / ${height}`,
  } as CSSProperties;

  const imageInner = onImageClick ? (
    <button
      type="button"
      onClick={onImageClick}
      className="blog-image-click-target w-full"
      aria-label={alt ? `View full size: ${alt}` : "View full size image"}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className="blog-image-img pointer-events-none h-auto w-full max-w-full"
        style={{ objectFit: "contain", height: "auto" }}
      />
    </button>
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes={sizes}
      className="blog-image-img h-auto w-full max-w-full"
      style={{ objectFit: "contain", height: "auto" }}
    />
  );

  return (
    <figure className={figureClass} style={style}>
      <div className="blog-image-frame p-2 sm:p-3">
        {imageInner}

        {frameActions ? <div className="blog-image-actions">{frameActions}</div> : null}
      </div>

      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
