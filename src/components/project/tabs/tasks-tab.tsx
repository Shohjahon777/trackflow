"use client";

import { useRef, useTransition } from "react";
import {
  Circle,
  CircleDot,
  CircleCheck,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createTask, toggleTaskStatus, deleteTask } from "@/actions/task";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  order: number;
};

type TasksTabProps = {
  tasks: Task[];
  projectId: string;
};

const statusIcon = {
  TODO: Circle,
  IN_PROGRESS: CircleDot,
  DONE: CircleCheck,
} as const;

const statusColor = {
  TODO: "text-text-tertiary hover:text-text-secondary",
  IN_PROGRESS: "text-[#5B8CA8] hover:text-[#4a7b97]",
  DONE: "text-[#3D8B6E] hover:text-[#2d7a5d]",
} as const;

const priorityColor = {
  HIGH: "bg-[#C26A6A]",
  MEDIUM: "bg-[#C4956A]",
  LOW: "bg-border",
} as const;

function isOverdue(date: Date | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function TaskRow({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const Icon = statusIcon[task.status as keyof typeof statusIcon] ?? Circle;

  return (
    <div
      className={cn(
        "group flex h-[40px] items-center gap-2 rounded-md border-[0.5px] border-border px-3 transition-colors hover:bg-surface",
        isPending && "opacity-50"
      )}
    >
      <button
        onClick={() => startTransition(async () => { await toggleTaskStatus(task.id); })}
        className={cn(
          "shrink-0 transition-colors",
          statusColor[task.status as keyof typeof statusColor]
        )}
      >
        <Icon size={16} strokeWidth={1.5} />
      </button>

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px]",
          task.status === "DONE"
            ? "text-text-tertiary line-through"
            : "text-text-primary"
        )}
      >
        {task.title}
      </span>

      {/* Priority dot */}
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          priorityColor[task.priority as keyof typeof priorityColor]
        )}
        title={task.priority.toLowerCase() + " priority"}
      />

      {/* Due date */}
      {task.dueDate && (
        <span
          className={cn(
            "shrink-0 font-mono text-[11px]",
            isOverdue(task.dueDate) && task.status !== "DONE"
              ? "text-[#C26A6A]"
              : "text-text-tertiary"
          )}
        >
          {formatDate(task.dueDate)}
        </span>
      )}

      <button
        onClick={() => startTransition(async () => { await deleteTask(task.id); })}
        className="shrink-0 text-text-tertiary opacity-0 transition-opacity hover:text-[#C26A6A] group-hover:opacity-100"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

export function TasksTab({ tasks, projectId }: TasksTabProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createTask(formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-4">
      {/* Add task input */}
      <form ref={formRef} action={handleSubmit}>
        <input type="hidden" name="projectId" value={projectId} />
        <div className="flex items-center gap-2 rounded-md border-[0.5px] border-border bg-surface px-3 py-2">
          <Plus size={14} className="shrink-0 text-text-tertiary" />
          <input
            name="title"
            placeholder="Add a task..."
            required
            className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
          <select
            name="priority"
            defaultValue="MEDIUM"
            className="bg-transparent text-[11px] text-text-secondary focus:outline-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <input
            name="dueDate"
            type="date"
            className="bg-transparent font-mono text-[11px] text-text-secondary focus:outline-none"
          />
        </div>
      </form>

      {/* Task groups */}
      {inProgressTasks.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <CircleDot size={12} className="text-[#5B8CA8]" />
            In progress
            <span className="font-mono">{inProgressTasks.length}</span>
          </h3>
          <div className="space-y-1">
            {inProgressTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {todoTasks.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <Circle size={12} />
            Todo
            <span className="font-mono">{todoTasks.length}</span>
          </h3>
          <div className="space-y-1">
            {todoTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {doneTasks.length > 0 && (
        <div>
          <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <CircleCheck size={12} className="text-[#3D8B6E]" />
            Done
            <span className="font-mono">{doneTasks.length}</span>
          </h3>
          <div className="space-y-1">
            {doneTasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && !isPending && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle size={24} className="mb-2 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">
            No tasks yet
          </p>
          <p className="text-[12px] text-text-tertiary">
            Add your first task above to start tracking your work.
          </p>
        </div>
      )}
    </div>
  );
}
