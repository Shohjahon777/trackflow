function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-fog dark:bg-surface-hover ${className ?? ""}`} />
  );
}

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-[28px] w-[180px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-[36px] w-[100px]" />
          <Skeleton className="h-[36px] w-[36px]" />
        </div>
      </div>

      {/* View toggle skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-[32px] w-[200px]" />
        <Skeleton className="ml-auto h-[36px] w-[240px]" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-md border-[0.5px] border-border p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-[18px] w-[140px]" />
              <Skeleton className="h-[22px] w-[70px] rounded-full" />
            </div>
            <Skeleton className="h-[14px] w-full" />
            <Skeleton className="h-[14px] w-3/4" />
            <div className="flex gap-1.5 pt-1">
              <Skeleton className="h-[22px] w-[60px] rounded-full" />
              <Skeleton className="h-[22px] w-[50px] rounded-full" />
              <Skeleton className="h-[22px] w-[70px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
