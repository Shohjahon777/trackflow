"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Flag,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarTabProps = {
  tasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: Date | null;
  }[];
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    dueDate: Date | null;
  }[];
  timeLogs: {
    id: string;
    description: string;
    duration: number;
    date: Date;
  }[];
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function toDateKey(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function CalendarTab({ tasks, milestones, timeLogs }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Index items by date
  const tasksByDate = new Map<string, typeof tasks>();
  for (const task of tasks) {
    if (task.dueDate) {
      const key = toDateKey(task.dueDate);
      const list = tasksByDate.get(key) ?? [];
      list.push(task);
      tasksByDate.set(key, list);
    }
  }

  const milestonesByDate = new Map<string, typeof milestones>();
  for (const ms of milestones) {
    if (ms.dueDate) {
      const key = toDateKey(ms.dueDate);
      const list = milestonesByDate.get(key) ?? [];
      list.push(ms);
      milestonesByDate.set(key, list);
    }
  }

  const logsByDate = new Map<string, typeof timeLogs>();
  for (const log of timeLogs) {
    const key = toDateKey(log.date);
    const list = logsByDate.get(key) ?? [];
    list.push(log);
    logsByDate.set(key, list);
  }

  const today = toDateKey(new Date());

  // Selected day items
  const selectedTasks = selectedDate ? (tasksByDate.get(selectedDate) ?? []) : [];
  const selectedMilestones = selectedDate
    ? (milestonesByDate.get(selectedDate) ?? [])
    : [];
  const selectedLogs = selectedDate ? (logsByDate.get(selectedDate) ?? []) : [];

  function prevMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-md border-[0.5px] border-border text-text-tertiary transition-colors hover:text-text-primary"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-[14px] font-medium text-text-primary">
          {monthName}
        </span>
        <button
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-md border-[0.5px] border-border text-text-tertiary transition-colors hover:text-text-primary"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-px">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="py-1.5 text-center text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px rounded-md border-[0.5px] border-border overflow-hidden">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-[72px] bg-surface/50" />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayTasks = tasksByDate.get(dateKey) ?? [];
          const dayMilestones = milestonesByDate.get(dateKey) ?? [];
          const dayLogs = logsByDate.get(dateKey) ?? [];
          const isToday = dateKey === today;
          const isSelected = dateKey === selectedDate;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateKey)}
              className={cn(
                "h-[72px] border-[0.5px] border-border/50 p-1.5 text-left transition-colors hover:bg-surface",
                isToday && "bg-accent-light/30",
                isSelected && "bg-accent-light ring-1 ring-accent/30"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[12px]",
                  isToday
                    ? "font-medium text-accent"
                    : "text-text-secondary"
                )}
              >
                {day}
              </span>
              <div className="mt-1 flex flex-wrap gap-0.5">
                {dayTasks.map((t) => (
                  <span
                    key={t.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      t.status === "DONE" ? "bg-[#3D8B6E]" : "bg-accent"
                    )}
                    title={t.title}
                  />
                ))}
                {dayMilestones.map((m) => (
                  <span
                    key={m.id}
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      m.completed ? "bg-[#3D8B6E]" : "bg-[#C4956A]"
                    )}
                    title={m.title}
                  />
                ))}
                {dayLogs.length > 0 && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-[#5B8CA8]"
                    title={`${dayLogs.length} time entries`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-text-tertiary">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Task due
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#C4956A]" />
          Milestone
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#5B8CA8]" />
          Time logged
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#3D8B6E]" />
          Completed
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDate && (selectedTasks.length > 0 || selectedMilestones.length > 0 || selectedLogs.length > 0) && (
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4 space-y-3">
          <span className="font-mono text-[12px] font-medium text-text-primary">
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>

          {selectedTasks.length > 0 && (
            <div className="space-y-1">
              {selectedTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2 text-[13px]">
                  <CheckSquare size={12} className="text-accent" />
                  <span className={cn(
                    t.status === "DONE" ? "text-text-tertiary line-through" : "text-text-primary"
                  )}>
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {selectedMilestones.length > 0 && (
            <div className="space-y-1">
              {selectedMilestones.map((m) => (
                <div key={m.id} className="flex items-center gap-2 text-[13px]">
                  <Flag size={12} className="text-[#C4956A]" />
                  <span className={cn(
                    m.completed ? "text-text-tertiary line-through" : "text-text-primary"
                  )}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {selectedLogs.length > 0 && (
            <div className="space-y-1">
              {selectedLogs.map((l) => (
                <div key={l.id} className="flex items-center gap-2 text-[13px]">
                  <Clock size={12} className="text-[#5B8CA8]" />
                  <span className="text-text-primary">{l.description}</span>
                  <span className="font-mono text-[11px] text-text-tertiary">
                    {formatDuration(l.duration)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
