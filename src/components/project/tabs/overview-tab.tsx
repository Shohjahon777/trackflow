"use client";

import {
  CheckSquare,
  Flag,
  Clock,
  GitCommit,
  ExternalLink,
  Lightbulb,
} from "lucide-react";
import type { GitHubCommit } from "@/lib/github";

type OverviewTabProps = {
  project: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    repoUrl: string | null;
    deployUrl: string | null;
  };
  taskCounts: { todo: number; inProgress: number; done: number };
  milestones: { id: string; completed: boolean }[];
  timeLogs: { duration: number }[];
  commits: GitHubCommit[];
  recentTasks: {
    id: string;
    title: string;
    status: string;
    priority: string;
    createdAt: Date;
  }[];
};

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function OverviewTab({
  taskCounts,
  milestones,
  timeLogs,
  commits,
  recentTasks,
}: OverviewTabProps) {
  const totalTasks = taskCounts.todo + taskCounts.inProgress + taskCounts.done;
  const milestoneDone = milestones.filter((m) => m.completed).length;
  const milestoneTotal = milestones.length;
  const milestonePercent = milestoneTotal > 0 ? Math.round((milestoneDone / milestoneTotal) * 100) : 0;
  const totalMinutes = timeLogs.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-text-tertiary" />
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Tasks
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-[20px] font-medium text-text-primary">
              {totalTasks}
            </span>
            <span className="text-[12px] text-text-secondary">
              {taskCounts.todo} todo · {taskCounts.inProgress} in progress · {taskCounts.done} done
            </span>
          </div>
        </div>

        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <Flag size={14} className="text-text-tertiary" />
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Milestones
            </span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[20px] font-medium text-text-primary">
                {milestoneDone}/{milestoneTotal}
              </span>
              <span className="text-[12px] text-text-secondary">
                {milestonePercent}% complete
              </span>
            </div>
            {milestoneTotal > 0 && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-[#3D8B6E] transition-all duration-300"
                  style={{ width: `${milestonePercent}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-tertiary" />
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Time logged
            </span>
          </div>
          <div className="mt-2">
            <span className="font-mono text-[20px] font-medium text-text-primary">
              {formatDuration(totalMinutes)}
            </span>
          </div>
        </div>
      </div>

      {/* Quick start tips — shown for new projects */}
      {totalTasks <= 2 && totalMinutes === 0 && (
        <div className="rounded-md border-[0.5px] border-accent/20 bg-accent-light/30 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb size={14} className="text-accent" />
            <span className="text-[12px] font-medium text-accent">Getting started</span>
          </div>
          <ul className="mt-2 space-y-1 text-[12px] leading-[1.6] text-text-secondary">
            <li><span className="text-text-primary">Tasks</span> — add tasks and click any task to edit, set priorities, due dates, and start a pomodoro timer</li>
            <li><span className="text-text-primary">Time log</span> — log hours manually or let the pomodoro timer auto-log sessions to tasks</li>
            <li><span className="text-text-primary">Brain</span> — save notes, architecture decisions, and reusable prompts. Click to read in full</li>
            <li><span className="text-text-primary">Calendar</span> — see tasks, milestones, and time entries on a monthly calendar view</li>
          </ul>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent tasks */}
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Recent tasks
          </h3>
          {recentTasks.length === 0 ? (
            <p className="mt-3 text-[13px] text-text-secondary">
              No tasks yet. Add tasks to track your work.
            </p>
          ) : (
            <div className="mt-3 space-y-1">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      task.status === "DONE"
                        ? "bg-[#3D8B6E]"
                        : task.status === "IN_PROGRESS"
                        ? "bg-[#5B8CA8]"
                        : "bg-border"
                    }`}
                  />
                  <span
                    className={`flex-1 text-[13px] ${
                      task.status === "DONE"
                        ? "text-text-tertiary line-through"
                        : "text-text-primary"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className="font-mono text-[11px] text-text-tertiary">
                    {timeAgo(task.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent commits */}
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Recent commits
          </h3>
          {commits.length === 0 ? (
            <p className="mt-3 text-[13px] text-text-secondary">
              No commits found. Link a GitHub repository to see commits.
            </p>
          ) : (
            <div className="mt-3 space-y-1">
              {commits.slice(0, 8).map((commit) => (
                <a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-surface"
                >
                  <GitCommit
                    size={14}
                    className="mt-0.5 shrink-0 text-text-tertiary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] text-text-primary group-hover:text-accent">
                      {commit.message}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="font-mono text-[11px] text-text-tertiary">
                      {commit.sha}
                    </span>
                    <span className="font-mono text-[11px] text-text-tertiary">
                      {commit.date ? timeAgo(commit.date) : ""}
                    </span>
                    <ExternalLink
                      size={10}
                      className="text-text-tertiary opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
