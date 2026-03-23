function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-fog dark:bg-surface-hover ${className ?? ""}`} />
  );
}

export default function ActivityLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-[28px] w-[140px]" />
      <Skeleton className="h-[120px] w-full rounded-md" />
      <Skeleton className="h-[14px] w-[120px]" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-[40px] w-full" />
        ))}
      </div>
    </div>
  );
}
