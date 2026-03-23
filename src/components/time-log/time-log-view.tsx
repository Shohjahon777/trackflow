"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTimeLog } from "@/actions/time-log";

type TimeLogEntry = {
  id: string;
  description: string;
  duration: number;
  cost: string | number | null;
  date: string | Date;
  project: {
    id: string;
    name: string;
    slug: string;
  };
};

type TimeLogStats = {
  weekMinutes: number;
  monthMinutes: number;
  totalCost: number;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatCost(value: string | number | null): string {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num === 0) return "—";
  return `$${num.toFixed(2)}`;
}

function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDateKey(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

function formatDateHeading(dateKey: string): string {
  const d = new Date(dateKey + "T00:00:00");
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayKey = today.toISOString().split("T")[0];
  const yesterdayKey = yesterday.toISOString().split("T")[0];

  if (dateKey === todayKey) return "Today";
  if (dateKey === yesterdayKey) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function groupByDate(
  logs: TimeLogEntry[]
): { dateKey: string; entries: TimeLogEntry[] }[] {
  const groups: Record<string, TimeLogEntry[]> = {};
  for (const log of logs) {
    const key = formatDateKey(log.date);
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, entries]) => ({ dateKey, entries }));
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border-[0.5px] border-border bg-background px-4 py-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
        {label}
      </span>
      <span className="font-mono text-[24px] font-medium leading-tight text-text-primary">
        {value}
      </span>
      {sub && (
        <span className="text-[11px] text-text-tertiary">{sub}</span>
      )}
    </div>
  );
}

function DeleteButton({ timeLogId }: { timeLogId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      await deleteTimeLog(timeLogId);
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      onClick={handleDelete}
      disabled={isPending}
      className="text-text-tertiary hover:text-danger"
    >
      <Trash2 size={14} />
    </Button>
  );
}

export function TimeLogView({
  logs,
  stats,
}: {
  logs: TimeLogEntry[];
  stats: TimeLogStats;
}) {
  const grouped = groupByDate(logs);

  const weekHours = Math.floor(stats.weekMinutes / 60);
  const weekMins = stats.weekMinutes % 60;
  const monthHours = Math.floor(stats.monthMinutes / 60);
  const monthMins = stats.monthMinutes % 60;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="This week"
          value={`${weekHours}h ${weekMins}m`}
          sub="hours logged"
        />
        <StatCard
          label="This month"
          value={`${monthHours}h ${monthMins}m`}
          sub="hours logged"
        />
        <StatCard
          label="Total cost"
          value={stats.totalCost > 0 ? `$${stats.totalCost.toFixed(2)}` : "$0"}
          sub="all time"
        />
      </div>

      {/* Time entries grouped by date */}
      {grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border-[0.5px] border-dashed border-border py-12 px-4 text-center">
          <p className="text-[14px] text-text-secondary">
            No time entries yet. Click &quot;Log time&quot; to add your first entry.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(({ dateKey, entries }) => {
            const dayTotal = entries.reduce((sum, e) => sum + e.duration, 0);
            return (
              <div key={dateKey} className="space-y-1">
                <div className="flex items-baseline justify-between px-1">
                  <h3 className="text-[13px] font-medium text-text-primary">
                    {formatDateHeading(dateKey)}
                  </h3>
                  <span className="font-mono text-[12px] text-text-tertiary">
                    {formatDuration(dayTotal)}
                  </span>
                </div>
                <div className="rounded-lg border-[0.5px] border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Duration</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="w-[40px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            <span className="inline-flex items-center rounded border-[0.5px] border-border bg-fog/50 px-1.5 py-0.5 font-mono text-[12px] text-accent dark:bg-surface-hover">
                              {entry.project.name}
                            </span>
                          </TableCell>
                          <TableCell className="text-text-body">
                            {entry.description}
                          </TableCell>
                          <TableCell className="text-right font-mono text-text-body">
                            {formatDuration(entry.duration)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-text-body">
                            {formatCost(entry.cost)}
                          </TableCell>
                          <TableCell>
                            <DeleteButton timeLogId={entry.id} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
