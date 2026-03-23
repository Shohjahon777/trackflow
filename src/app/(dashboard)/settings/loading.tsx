function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-fog dark:bg-surface-hover ${className ?? ""}`} />
  );
}

export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-[28px] w-[120px]" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-[14px] w-[100px]" />
            <Skeleton className="h-[36px] w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="ml-auto h-[36px] w-[120px]" />
    </div>
  );
}
