import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-light)] bg-[var(--bg-inverse)] py-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-display text-lg font-semibold text-[var(--text-inverse)]">
          {siteConfig.author.name}
        </p>
        <p className="font-ui text-sm text-[color:rgba(245,247,246,0.48)]">
          © {new Date().getFullYear()} — Writing about things that matter
        </p>
      </div>
    </footer>
  );
}
