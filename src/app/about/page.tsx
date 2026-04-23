import type { Metadata } from "next";
import Image from "next/image";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Teja Blog and the simple AI-focused writing behind the publication.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-16 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-6">
            <p className="font-ui text-sm font-semibold uppercase tracking-widest text-[var(--accent-text)]">About</p>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.015em] text-[var(--text-primary)] max-w-3xl">
              Simple writing about AI and the transition happening around us.
            </h1>
            <div className="max-w-2xl space-y-5 font-ui text-[1.05rem] leading-8 text-[var(--text-secondary)]">
              {siteConfig.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)] p-6 shadow-soft">
            <div className="relative mb-5 aspect-square overflow-hidden rounded-xl border border-[var(--border-medium)]">
              <Image
                src={siteConfig.author.image}
                alt={`${siteConfig.author.name} portrait`}
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="font-display text-[1.4rem] font-semibold text-[var(--text-primary)]">
                {siteConfig.author.name}
              </p>
              <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
                {siteConfig.author.role}
              </p>
              <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
                {siteConfig.domain}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-px bg-[var(--border-light)]" />
      </div>

      <section className="mx-auto max-w-[1200px] grid gap-10 px-6 py-16 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">What I Write</p>
          <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
            I write about AI tools, agent systems, product changes, and how
            people are starting to work differently because of them.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Why This Blog</p>
          <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
            AI is moving fast. I want this space to make the changes easier to
            understand without making them feel more complicated than they are.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-ui text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">How I Write</p>
          <p className="font-ui text-[0.9375rem] leading-[1.6] text-[var(--text-secondary)]">
            I try to keep the writing simple, honest, and useful. Clear ideas
            matter more to me than hype.
          </p>
        </div>
      </section>
    </main>
  );
}
