export default function BillingLoading() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      <div className="h-[24px] w-[80px] animate-pulse rounded bg-surface" />
      <div className="mt-2 h-[16px] w-[280px] animate-pulse rounded bg-surface" />

      {/* Plan card skeleton */}
      <div className="mt-8 rounded-lg border-[0.5px] border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="size-[40px] animate-pulse rounded-full bg-surface" />
          <div className="space-y-2">
            <div className="h-[18px] w-[120px] animate-pulse rounded bg-surface" />
            <div className="h-[14px] w-[200px] animate-pulse rounded bg-surface" />
          </div>
        </div>
      </div>

      {/* Usage skeleton */}
      <div className="mt-6 rounded-lg border-[0.5px] border-border bg-card p-6">
        <div className="h-[16px] w-[60px] animate-pulse rounded bg-surface" />
        <div className="mt-4 space-y-3">
          <div className="h-[14px] w-full animate-pulse rounded bg-surface" />
          <div className="h-[4px] w-full animate-pulse rounded-full bg-surface" />
        </div>
      </div>

      {/* Upgrade section skeleton */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <div className="h-[14px] w-[60px] animate-pulse rounded bg-surface" />
          <div className="mt-3 h-[36px] w-[80px] animate-pulse rounded bg-surface" />
          <div className="mt-4 h-[36px] w-full animate-pulse rounded bg-surface" />
        </div>
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <div className="h-[14px] w-[60px] animate-pulse rounded bg-surface" />
          <div className="mt-3 h-[36px] w-[80px] animate-pulse rounded bg-surface" />
          <div className="mt-4 h-[36px] w-full animate-pulse rounded bg-surface" />
        </div>
      </div>
    </div>
  );
}
