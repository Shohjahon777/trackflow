"use client";

import { Eye, MousePointerClick, Globe, TrendingUp } from "lucide-react";
import type { AnalyticsData } from "@/lib/analytics";

type AnalyticsViewProps = {
  data: AnalyticsData;
};

export function AnalyticsView({ data }: AnalyticsViewProps) {
  const maxViewCount = Math.max(...data.viewsByDay.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      <h1 className="text-[20px] font-medium text-text-primary">Analytics</h1>
      <p className="mt-1 text-[14px] text-text-secondary">
        Profile views and project engagement over the last 30 days.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Profile views"
          value={data.totalViews}
        />
        <StatCard
          icon={MousePointerClick}
          label="Project clicks"
          value={data.totalClicks}
        />
        <StatCard
          icon={Globe}
          label="Top referrer"
          value={data.topReferrers[0]?.referrer ?? "—"}
          isText
        />
        <StatCard
          icon={TrendingUp}
          label="Top project"
          value={data.topProjects[0]?.name ?? "—"}
          isText
        />
      </div>

      {/* Views chart (simple bar chart) */}
      <div className="mt-8 rounded-lg border-[0.5px] border-border bg-card p-6">
        <h3 className="text-[14px] font-medium text-text-primary">
          Daily profile views
        </h3>
        {data.viewsByDay.length === 0 ? (
          <p className="mt-4 text-center text-[13px] text-text-tertiary">
            No views yet. Share your profile to start tracking.
          </p>
        ) : (
          <div className="mt-4 flex items-end gap-1" style={{ height: 120 }}>
            {data.viewsByDay.map((day) => (
              <div
                key={day.date}
                className="group relative flex-1"
                style={{ height: "100%" }}
              >
                <div
                  className="absolute bottom-0 w-full rounded-t bg-accent/60 transition-colors group-hover:bg-accent"
                  style={{
                    height: `${Math.max((day.count / maxViewCount) * 100, 4)}%`,
                  }}
                />
                {/* Tooltip on hover */}
                <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded border-[0.5px] border-border bg-card px-2 py-1 text-[10px] text-text-secondary shadow-sm group-hover:block">
                  {day.count} · {day.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-column: referrers + top projects */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {/* Referrers */}
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <h3 className="text-[14px] font-medium text-text-primary">
            Top referrers
          </h3>
          {data.topReferrers.length === 0 ? (
            <p className="mt-4 text-[13px] text-text-tertiary">No data yet</p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.topReferrers.map((ref) => (
                <div key={ref.referrer} className="flex items-center justify-between">
                  <span className="truncate text-[13px] text-text-secondary">
                    {ref.referrer}
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-[12px] text-text-tertiary">
                    {ref.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top projects */}
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <h3 className="text-[14px] font-medium text-text-primary">
            Most clicked projects
          </h3>
          {data.topProjects.length === 0 ? (
            <p className="mt-4 text-[13px] text-text-tertiary">No data yet</p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.topProjects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between">
                  <span className="truncate text-[13px] text-text-secondary">
                    {proj.name}
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-[12px] text-text-tertiary">
                    {proj.clicks}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  isText = false,
}: {
  icon: typeof Eye;
  label: string;
  value: number | string;
  isText?: boolean;
}) {
  return (
    <div className="rounded-lg border-[0.5px] border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-text-tertiary" strokeWidth={1.5} />
        <span className="text-[12px] text-text-tertiary">{label}</span>
      </div>
      <p
        className={`mt-2 ${
          isText
            ? "truncate text-[14px] font-medium text-text-primary"
            : "font-mono text-[24px] font-medium text-text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
