"use client";

import { useRef, useTransition } from "react";
import { Clock, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { createTimeLog, deleteTimeLog } from "@/actions/time-log";

type TaskRef = {
  id: string;
  title: string;
};

type TimeLogEntry = {
  id: string;
  description: string;
  duration: number;
  cost: unknown;
  date: Date;
  task: TaskRef | null;
};

type TimeLogTabProps = {
  timeLogs: TimeLogEntry[];
  projectId: string;
  tasks: { id: string; title: string }[];
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TimeLogTab({ timeLogs, projectId, tasks }: TimeLogTabProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const totalMinutes = timeLogs.reduce((sum, t) => sum + t.duration, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthMinutes = timeLogs
    .filter((t) => new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.duration, 0);

  // Time per task summary
  const timePerTask = new Map<string, { title: string; minutes: number }>();
  for (const log of timeLogs) {
    if (log.task) {
      const existing = timePerTask.get(log.task.id);
      if (existing) {
        existing.minutes += log.duration;
      } else {
        timePerTask.set(log.task.id, { title: log.task.title, minutes: log.duration });
      }
    }
  }
  const taskSummary = Array.from(timePerTask.values()).sort(
    (a, b) => b.minutes - a.minutes
  );

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createTimeLog(formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Total logged
          </span>
          <p className="mt-1 font-mono text-[20px] font-medium text-text-primary">
            {formatDuration(totalMinutes)}
          </p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            This month
          </span>
          <p className="mt-1 font-mono text-[20px] font-medium text-text-primary">
            {formatDuration(thisMonthMinutes)}
          </p>
        </div>
      </div>

      {/* Time per task */}
      {taskSummary.length > 0 && (
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Time per task
          </span>
          <div className="mt-2 space-y-1.5">
            {taskSummary.map((entry) => (
              <div key={entry.title} className="flex items-center justify-between">
                <span className="truncate text-[13px] text-text-primary">
                  {entry.title}
                </span>
                <span className="shrink-0 font-mono text-[13px] font-medium text-text-primary">
                  {formatDuration(entry.minutes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add time log */}
      <form ref={formRef} action={handleSubmit} className="space-y-2">
        <input type="hidden" name="projectId" value={projectId} />
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-md border-[0.5px] border-border bg-surface px-3 py-2">
            <Plus size={14} className="shrink-0 text-text-tertiary" />
            <input
              name="description"
              placeholder="What did you work on?"
              required
              className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>
          <input
            name="hours"
            type="number"
            min="0"
            max="999"
            defaultValue="0"
            className="w-[56px] rounded-md border-[0.5px] border-border bg-surface px-2 py-2 text-center font-mono text-[13px] text-text-primary focus:outline-none"
          />
          <span className="text-[12px] text-text-tertiary">h</span>
          <input
            name="minutes"
            type="number"
            min="0"
            max="59"
            defaultValue="30"
            className="w-[56px] rounded-md border-[0.5px] border-border bg-surface px-2 py-2 text-center font-mono text-[13px] text-text-primary focus:outline-none"
          />
          <span className="text-[12px] text-text-tertiary">m</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            name="taskId"
            defaultValue=""
            className="flex-1 rounded-md border-[0.5px] border-border bg-surface px-3 py-2 text-[12px] text-text-secondary focus:outline-none"
          >
            <option value="">No task</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            required
            className="rounded-md border-[0.5px] border-border bg-surface px-2 py-2 font-mono text-[12px] text-text-secondary focus:outline-none"
          />
        </div>
      </form>

      {/* Time log list */}
      <div className="space-y-1">
        {timeLogs.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "group flex min-h-[40px] items-center gap-3 rounded-md border-[0.5px] border-border px-3 py-1.5 transition-colors hover:bg-surface",
              isPending && "opacity-50"
            )}
          >
            <Clock size={14} className="shrink-0 text-text-tertiary" />
            <span className="min-w-0 flex-1 truncate text-[13px] text-text-primary">
              {entry.description}
            </span>
            {entry.task && (
              <Badge variant="neutral">{entry.task.title}</Badge>
            )}
            <span className="shrink-0 font-mono text-[13px] font-medium text-text-primary">
              {formatDuration(entry.duration)}
            </span>
            {entry.cost != null && (
              <span className="shrink-0 font-mono text-[11px] text-text-secondary">
                ${Number(entry.cost).toFixed(2)}
              </span>
            )}
            <span className="shrink-0 font-mono text-[11px] text-text-tertiary">
              {formatDate(entry.date)}
            </span>
            <button
              onClick={() =>
                startTransition(async () => { await deleteTimeLog(entry.id); })
              }
              className="shrink-0 text-text-tertiary opacity-0 transition-opacity hover:text-[#C26A6A] group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {timeLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock size={24} className="mb-2 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">No time logged yet</p>
          <p className="mt-1 max-w-[340px] text-[12px] leading-[1.6] text-text-tertiary">
            Log time manually above or use the pomodoro timer inside any task. Link entries to tasks to see time-per-task breakdowns.
          </p>
        </div>
      )}
    </div>
  );
}
