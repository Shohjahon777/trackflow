"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Flag,
  Clock,
  Brain,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OverviewTab } from "./tabs/overview-tab";
import { TasksTab } from "./tabs/tasks-tab";
import { MilestonesTab } from "./tabs/milestones-tab";
import { TimeLogTab } from "./tabs/time-log-tab";
import { BrainTab } from "./tabs/brain-tab";
import { CalendarTab } from "./tabs/calendar-tab";
import type { GitHubCommit } from "@/lib/github";

type TaskTimeLog = {
  duration: number;
};

type ProjectTabsProps = {
  project: {
    id: string;
    name: string;
    status: string;
    description: string | null;
    repoUrl: string | null;
    deployUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  tasks: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
    order: number;
    createdAt: Date;
    pomodoroCount: number;
    pomodoroMinutes: number;
    timeLogs: TaskTimeLog[];
  }[];
  milestones: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    dueDate: Date | null;
    order: number;
  }[];
  timeLogs: {
    id: string;
    description: string;
    duration: number;
    cost: unknown;
    date: Date;
    task: { id: string; title: string } | null;
  }[];
  notes: {
    id: string;
    title: string;
    content: string;
    type: string;
    updatedAt: Date;
  }[];
  commits: GitHubCommit[];
};

const tabs = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "tasks", label: "Tasks", icon: CheckSquare },
  { value: "milestones", label: "Milestones", icon: Flag },
  { value: "time", label: "Time log", icon: Clock },
  { value: "calendar", label: "Calendar", icon: Calendar },
  { value: "brain", label: "Brain", icon: Brain },
] as const;

export function ProjectTabs({
  project,
  tasks,
  milestones,
  timeLogs,
  notes,
  commits,
}: ProjectTabsProps) {
  const [active, setActive] = useState("overview");

  const taskCounts = {
    todo: tasks.filter((t) => t.status === "TODO").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    done: tasks.filter((t) => t.status === "DONE").length,
  };

  const milestoneDone = milestones.filter((m) => m.completed).length;

  const badges: Record<string, string> = {
    tasks: String(taskCounts.todo + taskCounts.inProgress),
    milestones: `${milestoneDone}/${milestones.length}`,
    brain: String(notes.length),
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-md border-[0.5px] border-border bg-surface p-1">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActive(tab.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-[120ms]",
              active === tab.value
                ? "bg-accent-light text-accent"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            <tab.icon size={14} strokeWidth={1.5} />
            <span>{tab.label}</span>
            {badges[tab.value] && badges[tab.value] !== "0" && (
              <span
                className={cn(
                  "ml-0.5 font-mono text-[10px]",
                  active === tab.value ? "text-accent/70" : "text-text-tertiary"
                )}
              >
                {badges[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {active === "overview" && (
          <OverviewTab
            project={project}
            taskCounts={taskCounts}
            milestones={milestones}
            timeLogs={timeLogs}
            commits={commits}
            recentTasks={tasks.slice(0, 5)}
          />
        )}
        {active === "tasks" && (
          <TasksTab tasks={tasks} projectId={project.id} />
        )}
        {active === "milestones" && (
          <MilestonesTab milestones={milestones} projectId={project.id} />
        )}
        {active === "time" && (
          <TimeLogTab
            timeLogs={timeLogs}
            projectId={project.id}
            tasks={tasks.map((t) => ({ id: t.id, title: t.title }))}
          />
        )}
        {active === "calendar" && (
          <CalendarTab
            tasks={tasks}
            milestones={milestones}
            timeLogs={timeLogs}
          />
        )}
        {active === "brain" && (
          <BrainTab notes={notes} projectId={project.id} />
        )}
      </div>
    </div>
  );
}
