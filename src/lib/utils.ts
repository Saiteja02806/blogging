import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/** e.g. APR 26, 2026 — matches compact author byline in post headers. */
export function formatPostHeaderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
    .format(new Date(value))
    .toUpperCase();
}

export function shimmer(width: number, height: number) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#1D1F20" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
          <stop stop-color="#1D1F20" offset="20%" />
          <stop stop-color="#25282A" offset="50%" />
          <stop stop-color="#1D1F20" offset="80%" />
        </linearGradient>
      </defs>
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1.2s" repeatCount="indefinite" />
    </svg>
  `;
}

export function toBase64(value: string) {
  return Buffer.from(value).toString("base64");
}
