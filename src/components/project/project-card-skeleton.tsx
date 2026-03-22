import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-md border-[0.5px] border-border bg-background p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-5 w-16 rounded-sm" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-14 rounded-sm" />
        <Skeleton className="h-5 w-18 rounded-sm" />
        <Skeleton className="h-5 w-12 rounded-sm" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
