import Link from "next/link";
import {
  Github,
  ExternalLink,
  GitBranch,
  Zap,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ActivityHeatmap } from "@/components/profile/activity-heatmap";
import { LeagueBadge } from "@/components/profile/league-badge";
import { levelFromXp } from "@/lib/xp";
import type { ProjectStatus } from "@prisma/client";

const statusVariant: Record<string, "success" | "info"> = {
  DEPLOYED: "success",
  ACTIVE: "info",
};

type ProfileUser = {
  name: string | null;
  username: string;
  bio: string | null;
  image: string | null;
  githubUsername: string | null;
  createdAt: Date;
  xp: number;
  level: number;
  proofOfWorkScore: number;
  longestStreak: number;
};

type ProfileProject = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  stack: string[];
  deployUrl: string | null;
  repoUrl: string | null;
  updatedAt: Date;
};

type ActivityDay = {
  date: string;
  count: number;
};

type PublicProfileProps = {
  user: ProfileUser;
  projects: ProfileProject[];
  streak: number;
  techs: string[];
  activity?: ActivityDay[];
};

export function PublicProfile({
  user,
  projects,
  streak,
  techs,
  activity = [],
}: PublicProfileProps) {
  const displayName = user.name ?? user.username;
  const levelInfo = levelFromXp(user.xp);
  const xpProgress = Math.round(levelInfo.progress * 100);
  const leagueAccent = `var(--color-league-${levelInfo.league.slug}-accent)`;
  const leagueLight = `var(--color-league-${levelInfo.league.slug}-light)`;
  const leagueBorder = `var(--color-league-${levelInfo.league.slug}-border)`;
  const memberSince = user.createdAt.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-[720px] px-6 py-16 md:px-0">
      {/* Header */}
      <header className="flex items-start gap-5">
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="size-[72px] rounded-full ring-[1.5px] ring-offset-2 ring-offset-background"
            style={{ ["--tw-ring-color" as string]: leagueBorder }}
          />
        ) : (
          <div
            className="flex size-[72px] items-center justify-center rounded-full text-[24px] font-medium ring-[1.5px] ring-offset-2 ring-offset-background"
            style={{
              backgroundColor: leagueLight,
              color: leagueAccent,
              ["--tw-ring-color" as string]: leagueBorder,
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-[28px] font-medium leading-[1.2] text-text-primary">
            {displayName}
          </h1>
          <p className="mt-0.5 text-[14px] text-text-tertiary">@{user.username}</p>
        </div>

        {/* League emblem */}
        <div className="flex flex-col items-center">
          <LeagueBadge
            league={levelInfo.league.slug}
            tier={levelInfo.tier}
            size={56}
            fullName={levelInfo.fullName}
          />
          <p
            className="mt-1 font-mono text-[11px] font-medium"
            style={{ color: leagueAccent }}
          >
            {levelInfo.fullName}
          </p>
        </div>
      </header>
      <div className="ml-[92px]">
        {user.bio && (
          <p className="mt-2 max-w-[480px] text-[14px] leading-[1.7] text-text-secondary">
            {user.bio}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-[12px] text-text-tertiary">
          {user.githubUsername && (
            <a
              href={`https://github.com/${user.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-text-primary"
            >
              <Github size={13} strokeWidth={1.5} />
              {user.githubUsername}
            </a>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={13} strokeWidth={1.5} />
            Member since {memberSince}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Projects
          </span>
          <p className="mt-1 font-mono text-[24px] font-medium leading-none text-text-primary">
            {projects.length}
          </p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Proof of work
          </span>
          <p className="mt-1 flex items-baseline gap-1">
            <span
              className="font-mono text-[24px] font-medium leading-none"
              style={{ color: leagueAccent }}
            >
              {user.proofOfWorkScore}
            </span>
            <span className="font-mono text-[12px] text-text-tertiary">/100</span>
          </p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Ship streak
          </span>
          <p className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-[24px] font-medium leading-none text-text-primary">
              {streak}
            </span>
            <span className="text-[12px] text-text-tertiary">
              days{user.longestStreak > streak ? ` · best ${user.longestStreak}` : ""}
            </span>
          </p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            XP
          </span>
          <p className="mt-1 font-mono text-[24px] font-medium leading-none text-text-primary">
            {user.xp.toLocaleString()}
          </p>
          {levelInfo.nextMin !== null && (
            <div className="mt-2">
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full transition-all"
                  style={{ width: `${xpProgress}%`, backgroundColor: leagueAccent }}
                />
              </div>
              <p className="mt-1 font-mono text-[10px] text-text-tertiary">
                {(levelInfo.nextMin - user.xp).toLocaleString()} to {levelInfo.nextFullName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tech stack */}
      {techs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Tech stack
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {techs.map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Activity heatmap */}
      <div className="mt-8">
        <ActivityHeatmap data={activity} />
      </div>

      {/* Projects grid */}
      <div className="mt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Shipped projects
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-2 rounded-md border-[0.5px] border-border bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-medium text-text-primary">
                  {project.name}
                </h3>
                <Badge variant={statusVariant[project.status] ?? "info"}>
                  {project.status.toLowerCase()}
                </Badge>
              </div>
              {project.description && (
                <p className="line-clamp-2 text-[12px] text-text-secondary">
                  {project.description}
                </p>
              )}
              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.stack.map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-text-primary"
                  >
                    <GitBranch size={12} strokeWidth={1.5} />
                    <span className="font-mono">repo</span>
                  </a>
                )}
                {project.deployUrl && (
                  <a
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 transition-colors hover:text-text-primary"
                  >
                    <ExternalLink size={12} strokeWidth={1.5} />
                    <span className="font-mono">live</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-border pt-6 text-center">
        <Link
          href="/"
          className="font-mono text-[12px] text-text-tertiary transition-colors hover:text-text-primary"
        >
          TRACK<span className="text-accent">FLOW</span>
        </Link>
      </footer>
    </div>
  );
}
