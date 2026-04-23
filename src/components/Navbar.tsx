import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-[color:rgba(22,23,24,0.9)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl font-bold text-[var(--text-primary)] transition-colors hover:text-[var(--accent-text)]"
        >
          {siteConfig.author.name}
        </Link>

        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="font-ui text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Writing
          </Link>
          <Link
            href="/about"
            className="font-ui text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
