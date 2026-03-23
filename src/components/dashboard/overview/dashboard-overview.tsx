"use client";

import Link from "next/link";
import {
  FolderKanban,
  GitCommit,
  Zap,
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
  updatedAt: Date;
  milestonesDone: number;
  milestonesTotal: number;
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
  projects: OverviewProject[];
  recentCommits: RecentCommit[];
  recentNotes: RecentNote[];
  activityData: { date: string; count: number }[];
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
  projects,
  recentCommits,
  recentNotes,
  activityData,
}: DashboardOverviewProps) {
  const allOnboardingDone = Object.values(onboarding).every(Boolean);

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      {/* Welcome dialog for brand-new users */}
      <WelcomeDialog userName={userName} open={isNewUser} />

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
          label="Ship streak"
          value={`${stats.streak}d`}
          sub={stats.streak > 7 ? "On fire" : "Keep shipping"}
          icon={Zap}
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
              <span className="w-[30%]">Project</span>
              <span className="w-[14%] text-center">Status</span>
              <span className="w-[24%]">Stack</span>
              <span className="w-[16%] text-center">Milestones</span>
              <span className="w-[16%] text-center">Deploy</span>
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
                      <span className="text-[13px] font-medium text-text-primary">
                        {project.name}
                      </span>
                      <Badge variant={statusVariant[project.status]} className="text-[10px]">
                        {project.status.toLowerCase()}
                      </Badge>
                    </div>
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
                  </div>

                  {/* Desktop: table row */}
                  <div className="hidden w-full items-center md:flex">
                    <div className="flex w-[30%] items-center gap-2">
                      <span className={`size-[6px] rounded-full ${i === 0 ? "bg-accent" : "bg-ash"}`} />
                      <span className="text-[13px] font-medium text-text-primary">
                        {project.name}
                      </span>
                    </div>
                    <span className="flex w-[14%] justify-center">
                      <Badge variant={statusVariant[project.status]} className="text-[10px]">
                        {project.status.toLowerCase()}
                      </Badge>
                    </span>
                    <div className="flex w-[24%] gap-1">
                      {project.stack.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-sm bg-accent-light px-1.5 py-0.5 font-mono text-[10px] text-accent"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex w-[16%] items-center justify-center gap-1">
                      {project.milestonesTotal > 0 ? (
                        <>
                          <span className="font-mono text-[11px] text-text-secondary">
                            {project.milestonesDone}/{project.milestonesTotal}
                          </span>
                          <div className="h-[4px] w-[40px] overflow-hidden rounded-full bg-fog dark:bg-surface-hover">
                            <div
                              className="h-full rounded-full bg-success"
                              style={{
                                width: `${(project.milestonesDone / project.milestonesTotal) * 100}%`,
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <span className="text-[11px] text-text-tertiary">—</span>
                      )}
                    </div>
                    <span className="flex w-[16%] justify-center">
                      {project.deployUrl ? (
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
              {projects.filter((p) => p.deployUrl).length === 0 ? (
                <p className="text-center text-[12px] text-text-tertiary py-2">
                  No deployed projects yet.
                </p>
              ) : (
                projects
                  .filter((p) => p.deployUrl)
                  .slice(0, 5)
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="size-[6px] rounded-full bg-success" />
                      <span className="flex-1 truncate text-[12px] text-text-secondary">
                        {p.name}
                      </span>
                      <a
                        href={p.deployUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ash transition-colors hover:text-accent"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Activity mini heatmap */}
          {activityData.length > 0 && (
            <div className="rounded-md border-[0.5px] border-border">
              <div className="border-b border-border bg-surface px-4 py-2.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                  Activity (30d)
                </span>
              </div>
              <div className="px-4 py-3">
                <MiniHeatmap data={activityData} />
              </div>
            </div>
          )}

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

function MiniHeatmap({ data }: { data: { date: string; count: number }[] }) {
  // Show last 30 days as a simple grid
  const countMap = new Map(data.map((d) => [d.date, d.count]));
  const days: { date: string; count: number }[] = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    days.push({ date: dateStr, count: countMap.get(dateStr) ?? 0 });
  }

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex gap-[2px]">
      {days.map((day) => {
        const intensity = day.count / maxCount;
        return (
          <div
            key={day.date}
            className="flex-1 rounded-[2px]"
            style={{
              height: 20,
              backgroundColor:
                day.count === 0
                  ? "var(--fog)"
                  : `rgba(99, 102, 160, ${0.2 + intensity * 0.8})`,
            }}
            title={`${day.date}: ${day.count}`}
          />
        );
      })}
    </div>
  );
}

/* ─── Utilities ─── */

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
