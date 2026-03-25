"use client";

import { Timer, TrendingUp } from "lucide-react";

type PomodoroLog = {
  duration: number;
  date: Date;
  description: string;
};

type PomodoroReportProps = {
  pomodoroCount: number;
  pomodoroMinutes: number;
  timeLogs: PomodoroLog[];
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getDayLabel(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((today.getTime() - target.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function PomodoroReport({
  pomodoroCount,
  pomodoroMinutes,
  timeLogs,
}: PomodoroReportProps) {
  // Filter only pomodoro-related time logs
  const pomodoroLogs = timeLogs.filter((l) =>
    l.description.startsWith("Pomodoro session")
  );

  if (pomodoroCount === 0 && pomodoroLogs.length === 0) return null;

  const totalFocusMinutes = pomodoroLogs.reduce((sum, l) => sum + l.duration, 0);

  // Group sessions by day for the 7-day chart
  const now = new Date();
  const weekData: number[] = Array(7).fill(0);
  for (const log of pomodoroLogs) {
    const daysAgo = Math.floor(
      (now.getTime() - new Date(log.date).getTime()) / 86400000
    );
    if (daysAgo >= 0 && daysAgo < 7) {
      weekData[6 - daysAgo]++;
    }
  }
  const maxSessions = Math.max(...weekData, 1);

  // Day labels for the chart
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString("en-US", { weekday: "narrow" });
  });

  // Recent sessions (last 5, grouped by day)
  const recentLogs = pomodoroLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Days with activity (for average calc)
  const activeDays = new Set(
    pomodoroLogs.map((l) => new Date(l.date).toISOString().split("T")[0])
  ).size;
  const avgPerDay = activeDays > 0 ? (pomodoroLogs.length / activeDays).toFixed(1) : "0";

  return (
    <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <TrendingUp size={14} className="text-text-tertiary" />
        <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Focus report
        </span>
      </div>

      {/* Summary stats */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <span className="block font-mono text-[18px] font-medium text-text-primary">
            {pomodoroCount}
          </span>
          <span className="text-[11px] text-text-tertiary">sessions</span>
        </div>
        <div>
          <span className="block font-mono text-[18px] font-medium text-text-primary">
            {formatDuration(totalFocusMinutes)}
          </span>
          <span className="text-[11px] text-text-tertiary">focus time</span>
        </div>
        <div>
          <span className="block font-mono text-[18px] font-medium text-text-primary">
            {avgPerDay}
          </span>
          <span className="text-[11px] text-text-tertiary">avg/day</span>
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="mt-4">
        <span className="text-[11px] text-text-tertiary">Last 7 days</span>
        <div className="mt-2 flex items-end gap-1" style={{ height: 48 }}>
          {weekData.map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-accent/20 transition-all"
                style={{
                  height: count > 0 ? Math.max(4, (count / maxSessions) * 40) : 2,
                  backgroundColor:
                    count > 0
                      ? "var(--color-accent, #6366A0)"
                      : undefined,
                  opacity: count > 0 ? 0.6 : 0.15,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          {dayLabels.map((label, i) => (
            <span
              key={i}
              className="flex-1 text-center font-mono text-[9px] text-text-tertiary"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Recent sessions */}
      {recentLogs.length > 0 && (
        <div className="mt-4">
          <span className="text-[11px] text-text-tertiary">Recent sessions</span>
          <div className="mt-1.5 space-y-1">
            {recentLogs.map((log, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="text-text-secondary">
                  {getDayLabel(log.date)}
                </span>
                <span className="flex items-center gap-1 font-mono text-text-tertiary">
                  <Timer size={10} />
                  {formatDuration(log.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
