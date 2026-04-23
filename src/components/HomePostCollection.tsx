import { PostCard } from "@/components/PostCard";
import type { PostPreview } from "@/lib/types";

export function HomePostCollection({ posts }: { posts: PostPreview[] }) {
  if (posts.length === 0) {
    return (
      <section className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-ui text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
            Coming soon
          </p>
          <p className="mt-4 font-ui text-[1.05rem] leading-[1.7] text-[var(--text-secondary)]">
            Posts are on the way. Check back in a little while.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-16">
      <div className="mb-10">
        <h2 className="font-ui text-sm font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
          All Posts — {posts.length}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}
