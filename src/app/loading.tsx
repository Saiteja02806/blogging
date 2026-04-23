import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-1">
      <section className="editorial-shell pb-12 pt-14 md:pb-14 md:pt-20">
        <div className="max-w-2xl space-y-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-20 w-full max-w-2xl" />
          <Skeleton className="h-16 w-full max-w-xl" />
        </div>
      </section>

      <div className="editorial-shell">
        <div className="h-px bg-[var(--border-light)]" />
      </div>

      <section className="editorial-shell py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-64" />
        </div>
      </section>
    </main>
  );
}
