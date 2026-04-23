import { HomePostCollection } from "@/components/HomePostCollection";
import { getAllPosts } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--text-primary)] mb-6">
            Writing about things<br />that actually matter.
          </h1>
          <p className="font-ui text-[1.125rem] leading-[1.7] text-[var(--text-secondary)] max-w-xl">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="h-px bg-[var(--border-light)]" />
      </div>

      {/* Posts Grid */}
      <HomePostCollection posts={posts} />
    </main>
  );
}
