import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center py-24">
      <div className="editorial-shell">
        <div className="max-w-2xl space-y-6">
          <p className="font-ui text-sm font-semibold uppercase tracking-widest text-[var(--accent-text)]">Not Found</p>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[var(--text-primary)]">
            That post is not here anymore.
          </h1>
          <p className="font-ui text-[1.05rem] leading-8 text-[var(--text-secondary)] max-w-xl">
            The link may be out of date, or the post has moved. The writing index
            still knows the way back.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-ui text-sm font-medium text-[var(--accent-text)] transition-colors hover:text-[var(--accent-text-hover)] group"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  );
}
