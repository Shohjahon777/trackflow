export default function BotsLoading() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      <div className="h-[24px] w-[140px] animate-pulse rounded bg-surface" />
      <div className="mt-2 h-[16px] w-[320px] animate-pulse rounded bg-surface" />
      <div className="mt-6 space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-lg border-[0.5px] border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="size-[40px] animate-pulse rounded-full bg-surface" />
              <div className="space-y-2">
                <div className="h-[14px] w-[160px] animate-pulse rounded bg-surface" />
                <div className="h-[12px] w-[220px] animate-pulse rounded bg-surface" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
