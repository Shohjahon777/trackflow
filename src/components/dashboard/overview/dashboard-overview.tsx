"use client";

import Link from "next/link";
import {
  FolderKanban,
  GitCommit,
  Rocket,
  FileText,
  Share2,
  ExternalLink,
  CheckCircle2,
  Circle,
  ArrowRight,
  Terminal,
  GitPullRequest,
  Brain,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WelcomeDialog } from "@/components/dashboard/onboarding/welcome-dialog";
import { GettingStarted } from "@/components/dashboard/onboarding/getting-started";
import type { ProjectStatus, NoteType } from "@prisma/client";

const statusVariant: Record<string, "success" | "info" | "warning" | "neutral"> = {
  DEPLOYED: "success",
  ACTIVE: "info",
  STALE: "warning",
  ARCHIVED: "neutral",
  PAUSED: "neutral",
};

type OverviewProject = {
  id: string;
  name: string;
  status: ProjectStatus;
  stack: string[];
  deployUrl: string | null;
  repoUrl: string | null;
  updatedAt: Date;
  milestonesDone: number;
  milestonesTotal: number;
  tasksDone: number;
  tasksTotal: number;
  totalMinutes: number;
  weekActivity: number[];
  repoWarning: string | null;
};

type RecentCommit = {
  sha: string;
  message: string;
  date: string;
  repo: string;
};

type RecentNote = {
  id: string;
  title: string;
  type: NoteType;
  projectName: string;
  updatedAt: Date;
};

type OnboardingSteps = {
  hasUsername: boolean;
  hasProject: boolean;
  hasNote: boolean;
  hasShare: boolean;
  hasTimeLog: boolean;
  hasPublicProfile: boolean;
};

type DashboardOverviewProps = {
  userName: string;
  username: string | null;
  isNewUser: boolean;
  onboarding: OnboardingSteps;
  stats: {
    activeProjects: number;
    totalProjects: number;
    weeklyCommits: number;
    deployedCount: number;
    streak: number;
    notesCount: number;
    sharedCount: number;
  };
  openTasks: number;
  projects: OverviewProject[];
  recentCommits: RecentCommit[];
  recentNotes: RecentNote[];
  activityData?: { date: string; count: number }[];
  missingRepoScope?: boolean;
};

const noteIcon: Record<NoteType, typeof FileText> = {
  GENERAL: FileText,
  PROMPT: Terminal,
  ADR: GitPullRequest,
};

export function DashboardOverview({
  userName,
  username,
  isNewUser,
  onboarding,
  stats,
  openTasks,
  projects,
  recentCommits,
  recentNotes,
  activityData,
  missingRepoScope,
}: DashboardOverviewProps) {
  const allOnboardingDone = Object.values(onboarding).every(Boolean);

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Welcome dialog for brand-new users */}
      <WelcomeDialog userName={userName} open={isNewUser} />

      {/* Stale token warning */}
      {missingRepoScope && (
        <div className="flex items-start gap-3 rounded-md border-[0.5px] border-[#C4956A]/30 bg-[#FBF3EB] px-4 py-3 dark:border-warning/20 dark:bg-warning/5">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#C4956A]" strokeWidth={1.5} />
          <div>
            <p className="text-[13px] font-medium text-[#C4956A]">Private repos not accessible</p>
            <p className="mt-0.5 text-[12px] leading-[1.5] text-text-secondary">
              Your GitHub token doesn&apos;t have permission to access private repositories. Sign out and sign back in to refresh your permissions.
            </p>
          </div>
        </div>
      )}

      {/* Page header */}
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          {isNewUser ? `Welcome, ${userName?.split(" ")[0] ?? "there"}` : "Overview"}
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          {isNewUser
            ? "Let's set up your command center."
            : "Your command center at a glance."}
        </p>
      </div>

      {/* Getting started checklist — shows until all steps complete */}
      {!allOnboardingDone && (
        <GettingStarted steps={onboarding} username={username} />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="Active projects"
          value={stats.activeProjects}
          sub={`${stats.totalProjects} total`}
          icon={FolderKanban}
        />
        <StatCard
          label="Commits (7d)"
          value={stats.weeklyCommits}
          sub={stats.weeklyCommits > 0 ? "This week" : "No commits yet"}
          icon={GitCommit}
        />
        <StatCard
          label="Deployed"
          value={stats.deployedCount}
          sub={`${stats.sharedCount} shared`}
          icon={Rocket}
        />
        <StatCard
          label="Open tasks"
          value={openTasks}
          sub={openTasks === 0 ? "All caught up" : "Across all projects"}
          icon={CheckCircle2}
        />
      </div>

      {/* Main grid: projects table + activity sidebar */}
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* Left column */}
        <div className="space-y-4">
          {/* Project table */}
          <div className="overflow-hidden rounded-md border-[0.5px] border-border">
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Projects
              </span>
              <Link
                href="/projects"
                className="flex items-center gap-1 text-[12px] text-accent transition-colors hover:text-accent/80"
              >
                View all
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* Table header */}
            <div className="hidden items-center border-b border-border bg-surface/50 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.04em] text-text-tertiary md:flex">
              <span className="w-[22%]">Project</span>
              <span className="w-[10%] text-center">Status</span>
              <span className="w-[18%]">Stack</span>
              <span className="w-[10%] text-center">Tasks</span>
              <span className="w-[10%] text-center">Time</span>
              <span className="w-[14%] text-center">Activity (7d)</span>
              <span className="w-[10%] text-center">Milestones</span>
              <span className="w-[6%] text-center">Live</span>
            </div>

            {projects.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-text-tertiary">
                No projects yet.{" "}
                <Link href="/projects" className="text-accent">
                  Create one
                </Link>
              </div>
            ) : (
              projects.map((project, i) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`flex items-center border-b-[0.5px] border-border px-4 py-2.5 transition-colors duration-[120ms] last:border-0 hover:bg-fog dark:hover:bg-surface-hover ${
                    i === 0 ? "bg-accent-light/20" : ""
                  }`}
                >
                  {/* Mobile: stacked */}
                  <div className="flex w-full flex-col gap-1.5 md:hidden">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-[13px] font-medium text-text-primary">
                        {project.name}
                        {project.repoWarning && (
                          <span title={project.repoWarning}>
                            <AlertTriangle size={12} className="text-[#C4956A]" strokeWidth={1.5} />
                          </span>
                        )}
                      </span>
                      <Badge variant={statusVariant[project.status]} className="text-[10px]">
                        {project.status.toLowerCase()}
                      </Badge>
                    </div>
                    {project.stack.length > 0 && (
                      <div className="flex gap-1">
                        {project.stack.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-sm bg-accent-light px-1.5 py-0.5 font-mono text-[10px] text-accent"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
                      <span className="font-mono">{project.tasksDone}/{project.tasksTotal} tasks</span>
                      {project.totalMinutes > 0 && (
                        <span className="font-mono">{formatDuration(project.totalMinutes)}</span>
                      )}
                      <MiniSparkline data={project.weekActivity} />
                    </div>
                  </div>

                  {/* Desktop: table row */}
                  <div className="hidden w-full items-center md:flex">
                    <div className="flex w-[22%] items-center gap-2">
                      <span className={`size-[6px] shrink-0 rounded-full ${i === 0 ? "bg-accent" : "bg-ash"}`} />
                      <span className="truncate text-[13px] font-medium text-text-primary">
                        {project.name}
                      </span>
                      {project.repoWarning && (
                        <span title={project.repoWarning} className="shrink-0">
                          <AlertTriangle size={12} className="text-[#C4956A]" strokeWidth={1.5} />
                        </span>
                      )}
                    </div>
                    <span className="flex w-[10%] justify-center">
                      <Badge variant={statusVariant[project.status]} className="text-[10px]">
                        {project.status.toLowerCase()}
                      </Badge>
                    </span>
                    <div className="flex w-[18%] gap-1 overflow-hidden">
                      {project.stack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="shrink-0 rounded-sm bg-accent-light px-1.5 py-0.5 font-mono text-[10px] text-accent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex w-[10%] items-center justify-center">
                      <span className="font-mono text-[11px] text-text-secondary">
                        {project.tasksDone}/{project.tasksTotal}
                      </span>
                    </div>
                    <div className="flex w-[10%] items-center justify-center">
                      <span className="font-mono text-[11px] text-text-secondary">
                        {project.totalMinutes > 0 ? formatDuration(project.totalMinutes) : "—"}
                      </span>
                    </div>
                    <div className="flex w-[14%] items-center justify-center gap-[2px]">
                      <MiniSparkline data={project.weekActivity} />
                    </div>
                    <div className="flex w-[10%] items-center justify-center gap-1">
                      {project.milestonesTotal > 0 ? (
                        <>
                          <span className="font-mono text-[11px] text-text-secondary">
                            {project.milestonesDone}/{project.milestonesTotal}
                          </span>
                        </>
                      ) : (
                        <span className="text-[11px] text-text-tertiary">—</span>
                      )}
                    </div>
                    <span className="flex w-[6%] justify-center">
                      {project.deployUrl || project.status === "DEPLOYED" ? (
                        <CheckCircle2 size={14} className="text-success" strokeWidth={1.5} />
                      ) : (
                        <Circle size={14} className="text-ash" strokeWidth={1} />
                      )}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Recent notes */}
          {recentNotes.length > 0 && (
            <div className="rounded-md border-[0.5px] border-border">
              <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                  Recent notes
                </span>
                <Link
                  href="/brain"
                  className="flex items-center gap-1 text-[12px] text-accent transition-colors hover:text-accent/80"
                >
                  View all
                  <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-border">
                {recentNotes.map((note) => {
                  const Icon = noteIcon[note.type];
                  return (
                    <div
                      key={note.id}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-fog dark:hover:bg-surface-hover"
                    >
                      <Icon size={14} className="shrink-0 text-ash" strokeWidth={1.5} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] text-text-primary">
                          {note.title}
                        </p>
                        <p className="text-[11px] text-text-tertiary">
                          {note.projectName}
                        </p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] text-text-tertiary">
                        {timeAgo(note.updatedAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column: activity feed */}
        <div className="space-y-4">
          {/* Live commits */}
          <div className="rounded-md border-[0.5px] border-border">
            <div className="border-b border-border bg-surface px-4 py-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Recent commits
              </span>
            </div>
            {recentCommits.length === 0 ? (
              <div className="px-4 py-6 text-center text-[12px] text-text-tertiary">
                No recent commits.
                <br />
                Link a GitHub repo to see activity.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentCommits.map((commit, i) => (
                  <div
                    key={`${commit.sha}-${i}`}
                    className="flex gap-2.5 px-4 py-2.5"
                  >
                    <GitCommit
                      size={13}
                      className={`mt-0.5 shrink-0 ${i === 0 ? "text-accent" : "text-ash"}`}
                      strokeWidth={i === 0 ? 2 : 1.5}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-medium leading-tight text-text-primary">
                        {commit.message}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="font-mono text-[10px] text-accent">
                          {commit.sha}
                        </span>
                        <span className="font-mono text-[10px] text-text-tertiary">
                          {commit.repo}
                        </span>
                        <span className="text-[10px] text-text-tertiary">
                          {timeAgo(new Date(commit.date))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Deploy status */}
          <div className="rounded-md border-[0.5px] border-border">
            <div className="border-b border-border bg-surface px-4 py-2.5">
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Deploy status
              </span>
            </div>
            <div className="px-4 py-3 space-y-2">
              {projects.filter((p) => p.deployUrl || p.status === "DEPLOYED").length === 0 ? (
                <p className="text-center text-[12px] text-text-tertiary py-2">
                  No deployed projects yet.
                </p>
              ) : (
                projects
                  .filter((p) => p.deployUrl || p.status === "DEPLOYED")
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className={`size-[6px] rounded-full ${p.deployUrl ? "bg-success" : "bg-[#C4956A]"}`} />
                      <span className="flex-1 truncate text-[12px] text-text-secondary">
                        {p.name}
                      </span>
                      {p.deployUrl ? (
                        <a
                          href={p.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ash transition-colors hover:text-accent"
                        >
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-text-tertiary">no url</span>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-1">
            <QuickLink href="/projects" icon={FolderKanban} label="All projects" />
            <QuickLink href="/brain" icon={Brain} label="Project brain" />
            <QuickLink href="/shares" icon={Share2} label="Share links" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: typeof FolderKanban;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border-[0.5px] border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-tertiary">{label}</span>
        <Icon size={14} className="text-text-tertiary" strokeWidth={1.5} />
      </div>
      <span className="font-mono text-[28px] font-medium leading-none text-text-primary">
        {value}
      </span>
      <span className="text-[11px] text-text-tertiary">{sub}</span>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof FolderKanban;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
    >
      <Icon size={14} strokeWidth={1.5} />
      {label}
      <ArrowRight size={12} className="ml-auto text-ash" />
    </Link>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const total = data.reduce((s, v) => s + v, 0);

  return (
    <div className="flex items-end gap-[2px]" title={`${total} actions this week`}>
      {data.map((v, i) => (
        <div
          key={i}
          className="w-[4px] rounded-[1px]"
          style={{
            height: v === 0 ? 3 : Math.max(4, (v / max) * 16),
            backgroundColor: v === 0
              ? "var(--color-border, #D4D4CE)"
              : `rgba(99, 102, 160, ${0.35 + (v / max) * 0.65})`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Utilities ─── */

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}m`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
