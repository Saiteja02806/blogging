import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-px w-full rounded-none" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
