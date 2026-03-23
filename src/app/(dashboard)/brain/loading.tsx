function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-fog dark:bg-surface-hover ${className ?? ""}`} />
  );
}

export default function BrainLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-[28px] w-[160px]" />
        <Skeleton className="h-[36px] w-[120px]" />
      </div>

      {/* Type tabs + search */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[32px] w-[80px] rounded-md" />
          ))}
        </div>
        <Skeleton className="ml-auto h-[36px] w-[240px]" />
      </div>

      {/* Section label */}
      <Skeleton className="h-[14px] w-[80px]" />

      {/* Note cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-md border-[0.5px] border-border p-4"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-[28px] rounded-md" />
              <Skeleton className="h-[16px] w-[160px]" />
            </div>
            <Skeleton className="h-[60px] w-full rounded-md" />
            <Skeleton className="ml-auto h-[12px] w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
