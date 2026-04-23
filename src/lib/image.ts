import imageUrlBuilder from "@sanity/image-url";

import { client, isSanityConfigured } from "@/lib/sanity";
import { shimmer, toBase64 } from "@/lib/utils";

const builder = imageUrlBuilder(client);

export function urlFor(source: unknown) {
  return builder.image(source as never);
}

export function resolveImageUrl(
  source: unknown,
  options: {
    width?: number;
    height?: number;
    fit?: "crop" | "fill" | "max" | "clip" | "scale" | "min";
    quality?: number;
  } = {},
) {
  if (!source) {
    return null;
  }

  if (typeof source === "string") {
    return source;
  }

  if (!isSanityConfigured) {
    return null;
  }

  let image = urlFor(source).auto("format");

  if (options.width) {
    image = image.width(options.width);
  }

  if (options.height) {
    image = image.height(options.height);
  }

  if (options.fit) {
    image = image.fit(options.fit);
  }

  if (options.quality) {
    image = image.quality(options.quality);
  }

  return image.url();
}

export function resolvePortableTextImageUrl(value: Record<string, unknown>) {
  const assetUrl = value.assetUrl;

  if (typeof assetUrl === "string") {
    return assetUrl;
  }

  return resolveImageUrl(value, { width: 1400, fit: "max" });
}

export function getBlurDataURL() {
  return `data:image/svg+xml;base64,${toBase64(shimmer(1200, 675))}`;
}
