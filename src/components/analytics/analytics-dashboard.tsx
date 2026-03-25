"use client";

import {
  Eye,
  MousePointerClick,
  Globe,
  TrendingUp,
  Lock,
  Target,
  Calendar,
} from "lucide-react";
import type { AnalyticsData } from "@/lib/analytics";

type Props = {
  data: AnalyticsData;
};

export function AnalyticsDashboard({ data }: Props) {
  const maxViewCount = Math.max(...data.viewsByDay.map((d) => d.count), 1);

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Analytics
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Profile views and project engagement over the last 30 days.
        </p>
      </div>

      {/* Stat cards — visible to all */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Eye} label="Profile views" value={data.totalViews} />
        <StatCard icon={MousePointerClick} label="Project clicks" value={data.totalClicks} />
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

      {/* Views chart — visible to all */}
      <div className="mt-8 rounded-lg border-[0.5px] border-border bg-card p-6">
        <h3 className="text-[14px] font-medium text-text-primary">
          Daily profile views
        </h3>
        {data.viewsByDay.length === 0 ? (
          <div className="mt-6 flex flex-col items-center py-4">
            <Eye size={20} className="text-text-tertiary" strokeWidth={1.5} />
            <p className="mt-2 text-[13px] text-text-tertiary">
              No views yet. Share your public profile to start tracking.
            </p>
          </div>
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
                <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded border-[0.5px] border-border bg-card px-2 py-1 text-[10px] text-text-secondary shadow-sm group-hover:block">
                  {day.count} · {day.date.slice(5)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Three-column: referrers + top projects + countries */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  <span className="truncate text-[13px] text-text-secondary">{ref.referrer}</span>
                  <span className="ml-2 shrink-0 font-mono text-[12px] text-text-tertiary">{ref.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

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
                  <span className="truncate text-[13px] text-text-secondary">{proj.name}</span>
                  <span className="ml-2 shrink-0 font-mono text-[12px] text-text-tertiary">{proj.clicks}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-medium text-text-primary">
              Visitor regions
            </h3>
            <Globe size={13} className="text-text-tertiary" strokeWidth={1.5} />
          </div>
          {data.topCountries.length === 0 ? (
            <p className="mt-4 text-[13px] text-text-tertiary">
              No data yet — country is captured automatically on Vercel.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.topCountries.map((c) => (
                <div key={c.country} className="flex items-center justify-between">
                  <span className="text-[13px] text-text-secondary">
                    {regionLabel(c.country)}
                  </span>
                  <span className="ml-2 shrink-0 font-mono text-[12px] text-text-tertiary">{c.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pro features — locked cards */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Coming with Pro
          </span>
          <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.06em] bg-accent/10 text-accent">
            Soon
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <LockedFeatureCard
            icon={Target}
            title="Click-through rates"
            description="Conversion from profile view to project click, per project."
          />
          <LockedFeatureCard
            icon={TrendingUp}
            title="Trending periods"
            description="Detect traffic spikes and see which days perform best."
          />
          <LockedFeatureCard
            icon={Calendar}
            title="Time-range comparison"
            description="Compare analytics across custom date ranges to spot growth trends."
          />
        </div>
      </div>
    </div>
  );
}

/** Convert ISO 3166-1 alpha-2 country code to display name */
function regionLabel(code: string): string {
  if (code === "Unknown") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
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

function LockedFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Lock;
  title: string;
  description: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border-[0.5px] border-border bg-card p-5">
      {/* Subtle lock overlay */}
      <div className="absolute right-3 top-3">
        <Lock size={12} className="text-text-tertiary/50" strokeWidth={1.5} />
      </div>
      <Icon size={18} className="text-accent/40" strokeWidth={1.5} />
      <h4 className="mt-3 text-[13px] font-medium text-text-primary">{title}</h4>
      <p className="mt-1 text-[12px] leading-[1.5] text-text-tertiary">{description}</p>
    </div>
  );
}
