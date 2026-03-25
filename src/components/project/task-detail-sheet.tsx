"use client";

import { useState, useTransition } from "react";
import {
  Circle,
  CircleDot,
  CircleCheck,
  Trash2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { updateTaskFields, deleteTask } from "@/actions/task";
import { PomodoroTimer } from "@/components/project/pomodoro-timer";

type TaskTimeLog = {
  duration: number;
};

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  pomodoroCount: number;
  pomodoroMinutes: number;
  timeLogs: TaskTimeLog[];
};

type TaskDetailSheetProps = {
  task: TaskData;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusOptions = [
  { value: "TODO", label: "Todo", icon: Circle, color: "text-text-tertiary" },
  { value: "IN_PROGRESS", label: "In progress", icon: CircleDot, color: "text-[#5B8CA8]" },
  { value: "DONE", label: "Done", icon: CircleCheck, color: "text-[#3D8B6E]" },
] as const;

const priorityOptions = [
  { value: "LOW", label: "Low", color: "bg-border" },
  { value: "MEDIUM", label: "Medium", color: "bg-[#C4956A]" },
  { value: "HIGH", label: "High", color: "bg-[#C26A6A]" },
] as const;

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function TaskDetailSheet({
  task,
  projectId,
  open,
  onOpenChange,
}: TaskDetailSheetProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const totalTimeLogged = task.timeLogs.reduce((sum, t) => sum + t.duration, 0);

  function save() {
    startTransition(async () => {
      await updateTaskFields(task.id, {
        title,
        description: description || undefined,
        status,
        priority,
        dueDate: dueDate || null,
      });
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteTask(task.id);
      onOpenChange(false);
    });
  }

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus);
    startTransition(async () => {
      await updateTaskFields(task.id, { status: newStatus });
    });
  }

  function handlePriorityChange(newPriority: string) {
    setPriority(newPriority);
    startTransition(async () => {
      await updateTaskFields(task.id, { priority: newPriority });
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">Task detail</SheetTitle>
          <SheetDescription className="sr-only">Edit task details</SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-4 pb-4">
          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={save}
            className="w-full bg-transparent text-[18px] font-medium text-text-primary placeholder:text-text-tertiary focus:outline-none"
            placeholder="Task title"
          />

          {/* Status */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Status
            </span>
            <div className="mt-1.5 flex gap-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border-[0.5px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    status === opt.value
                      ? "border-accent/30 bg-accent-light text-accent"
                      : "border-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  <opt.icon size={14} strokeWidth={1.5} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Priority
            </span>
            <div className="mt-1.5 flex gap-1">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePriorityChange(opt.value)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border-[0.5px] px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                    priority === opt.value
                      ? "border-accent/30 bg-accent-light text-accent"
                      : "border-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", opt.color)} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Due date
            </span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              onBlur={save}
              className="mt-1.5 w-full rounded-md border-[0.5px] border-border bg-surface px-3 py-2 font-mono text-[13px] text-text-primary focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={save}
              rows={4}
              placeholder="Add a description..."
              className="mt-1.5 w-full resize-none rounded-md border-[0.5px] border-border bg-surface px-3 py-2 text-[13px] leading-[1.6] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>

          {/* Pomodoro timer */}
          <PomodoroTimer
            taskId={task.id}
            projectId={projectId}
            taskName={task.title}
            durationMinutes={task.pomodoroMinutes}
            completedCount={task.pomodoroCount}
          />

          {/* Time tracking summary */}
          <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-tertiary" />
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Time tracked
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-[20px] font-medium text-text-primary">
                {formatDuration(totalTimeLogged)}
              </span>
              <Badge variant="neutral">
                {task.pomodoroCount} pomodoro{task.pomodoroCount !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-accent px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save changes"}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center gap-1.5 rounded-md border-[0.5px] border-[#C26A6A]/30 px-3 py-2 text-[13px] text-[#C26A6A] transition-colors hover:bg-[#FBEDED] disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
