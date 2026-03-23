"use client";

import { useRef, useTransition } from "react";
import { Circle, CheckCircle2, Trash2, Plus, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createMilestone,
  toggleMilestone,
  deleteMilestone,
} from "@/actions/milestone";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  dueDate: Date | null;
  order: number;
};

type MilestonesTabProps = {
  milestones: Milestone[];
  projectId: string;
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function MilestonesTab({ milestones, projectId }: MilestonesTabProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const doneCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const percent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createMilestone(formData);
      formRef.current?.reset();
    });
  }

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-text-primary">
              {doneCount} of {totalCount} milestones complete
            </span>
            <span className="font-mono text-[13px] font-medium text-text-primary">
              {percent}%
            </span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-[#3D8B6E] transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Add milestone */}
      <form ref={formRef} action={handleSubmit}>
        <input type="hidden" name="projectId" value={projectId} />
        <div className="flex items-center gap-2 rounded-md border-[0.5px] border-border bg-surface px-3 py-2">
          <Plus size={14} className="shrink-0 text-text-tertiary" />
          <input
            name="title"
            placeholder="Add a milestone..."
            required
            className="flex-1 bg-transparent text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
          />
        </div>
      </form>

      {/* Milestone list */}
      <div className="space-y-1">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className={cn(
              "group flex items-start gap-2 rounded-md border-[0.5px] border-border px-3 py-2.5 transition-colors hover:bg-surface",
              isPending && "opacity-50"
            )}
          >
            <button
              onClick={() =>
                startTransition(async () => { await toggleMilestone(milestone.id); })
              }
              className={cn(
                "mt-0.5 shrink-0 transition-colors",
                milestone.completed
                  ? "text-[#3D8B6E] hover:text-[#2d7a5d]"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {milestone.completed ? (
                <CheckCircle2 size={16} strokeWidth={1.5} />
              ) : (
                <Circle size={16} strokeWidth={1.5} />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <span
                className={cn(
                  "text-[13px]",
                  milestone.completed
                    ? "text-text-tertiary line-through"
                    : "text-text-primary"
                )}
              >
                {milestone.title}
              </span>
              {milestone.description && (
                <p className="mt-0.5 text-[12px] text-text-tertiary">
                  {milestone.description}
                </p>
              )}
            </div>

            {milestone.dueDate && (
              <span className="shrink-0 font-mono text-[11px] text-text-tertiary">
                {formatDate(milestone.dueDate)}
              </span>
            )}

            <button
              onClick={() =>
                startTransition(async () => { await deleteMilestone(milestone.id); })
              }
              className="shrink-0 text-text-tertiary opacity-0 transition-opacity hover:text-[#C26A6A] group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {milestones.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Flag size={24} className="mb-2 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">No milestones yet</p>
          <p className="text-[12px] text-text-tertiary">
            Add milestones to track your project&apos;s progress.
          </p>
        </div>
      )}
    </div>
  );
}
