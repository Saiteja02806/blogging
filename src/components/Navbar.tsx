import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[color:rgba(22,23,24,0.92)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-bold text-[var(--text-primary)] transition-colors hover:text-[var(--accent-text)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] rounded-sm"
        >
          {siteConfig.author.name}
        </Link>

        <nav
          className="flex min-w-0"
          aria-label="Primary"
        >
          <ul className="flex list-none items-center gap-0 p-0 m-0 sm:gap-1">
            <li className="m-0 p-0">
              <Link
                href="/"
                className="inline-block rounded-sm px-2.5 py-1.5 font-ui text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] sm:px-1"
              >
                All posts
              </Link>
            </li>
            <li
              className="hidden h-4 w-px shrink-0 self-center bg-[var(--border-medium)] sm:block"
              aria-hidden
            />
            <li className="m-0 p-0">
              <Link
                href="/about"
                className="inline-block rounded-sm px-2.5 py-1.5 font-ui text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--accent-text)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] sm:px-1"
              >
                About
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
