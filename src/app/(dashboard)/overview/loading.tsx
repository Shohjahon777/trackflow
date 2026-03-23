function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-fog dark:bg-surface-hover ${className ?? ""}`} />
  );
}

export default function OverviewLoading() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-[28px] w-[140px]" />
        <Skeleton className="mt-2 h-[16px] w-[260px]" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-md border-[0.5px] border-border p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-[14px] w-[80px]" />
              <Skeleton className="size-[14px]" />
            </div>
            <Skeleton className="h-[32px] w-[60px]" />
            <Skeleton className="h-[12px] w-[100px]" />
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Projects table */}
        <div className="rounded-md border-[0.5px] border-border">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
            <Skeleton className="h-[14px] w-[60px]" />
            <Skeleton className="h-[14px] w-[60px]" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center border-b-[0.5px] border-border px-4 py-3">
              <Skeleton className="h-[14px] w-full" />
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-md border-[0.5px] border-border">
            <div className="border-b border-border bg-surface px-4 py-2.5">
              <Skeleton className="h-[14px] w-[100px]" />
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-2.5">
                <Skeleton className="h-[14px] w-full" />
                <Skeleton className="mt-1 h-[10px] w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
