import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-[680px] px-6 pb-8 pt-16">
        <Skeleton className="mb-10 h-5 w-32" />
        <div className="space-y-6">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-20 w-full max-w-2xl" />
          <Skeleton className="h-px w-full rounded-none" />
        </div>
      </section>

      <div className="mx-auto max-w-[900px] px-6 mb-14">
        <Skeleton className="aspect-video rounded-2xl" />
      </div>

      <section className="mx-auto max-w-[680px] space-y-5 px-6 pb-24">
        <Skeleton className="h-7 w-full" />
        <Skeleton className="h-7 w-[92%]" />
        <Skeleton className="h-7 w-[86%]" />
        <Skeleton className="h-7 w-full" />
      </section>
    </main>
  );
}
