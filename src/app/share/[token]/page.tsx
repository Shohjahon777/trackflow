import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, CheckCircle2, Circle, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProjectByShareToken } from "@/actions/share";
import type { ProjectStatus } from "@prisma/client";

const statusVariant: Record<ProjectStatus, "success" | "info" | "warning" | "neutral"> = {
  DEPLOYED: "success",
  ACTIVE: "info",
  STALE: "warning",
  ARCHIVED: "neutral",
  PAUSED: "neutral",
};

const statusLabel: Record<ProjectStatus, string> = {
  DEPLOYED: "Deployed & live",
  ACTIVE: "In active development",
  STALE: "On hold",
  ARCHIVED: "Archived",
  PAUSED: "Paused",
};

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const project = await getProjectByShareToken(token);

  if (!project) {
    notFound();
  }

  const completedMilestones = project.milestones.filter((m) => m.completed).length;
  const totalMilestones = project.milestones.length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const lastUpdated = project.updatedAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const startedOn = project.createdAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[680px] px-6 py-16 md:px-0">
        {/* Status indicator */}
        <div className="mb-8">
          <Badge variant={statusVariant[project.status]} className="text-[12px]">
            {statusLabel[project.status]}
          </Badge>
        </div>

        {/* Project header — spacious mode */}
        <header className="space-y-4">
          <h1 className="text-[32px] font-medium leading-[1.2] text-text-primary">
            {project.name}
          </h1>
          {project.description && (
            <p className="max-w-[560px] text-[15px] leading-[1.7] text-text-secondary">
              {project.description}
            </p>
          )}
        </header>

        {/* Meta cards — spacious 24px padding, 32px section gap */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg border-[0.5px] border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-text-tertiary" strokeWidth={1.5} />
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Started
              </span>
            </div>
            <p className="mt-2 font-mono text-[14px] text-text-primary">{startedOn}</p>
          </div>
          <div className="rounded-lg border-[0.5px] border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-text-tertiary" strokeWidth={1.5} />
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Last updated
              </span>
            </div>
            <p className="mt-2 font-mono text-[14px] text-text-primary">{lastUpdated}</p>
          </div>
        </div>

        {/* Tech stack */}
        {project.stack.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Tech stack
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <Badge key={tech} variant="tech" className="px-3 py-1 text-[12px]">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Milestones */}
        {totalMilestones > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Milestones
              </h2>
              <span className="font-mono text-[12px] text-text-tertiary">
                {completedMilestones}/{totalMilestones} completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-[6px] w-full overflow-hidden rounded-full bg-fog dark:bg-surface-hover">
              <div
                className="h-full rounded-full bg-success transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Milestone list */}
            <div className="mt-4 space-y-2">
              {project.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center gap-3 rounded-md border-[0.5px] border-border bg-surface px-4 py-3"
                >
                  {milestone.completed ? (
                    <CheckCircle2 size={16} className="shrink-0 text-success" strokeWidth={1.5} />
                  ) : (
                    <Circle size={16} className="shrink-0 text-ash" strokeWidth={1.5} />
                  )}
                  <span
                    className={`text-[13px] ${
                      milestone.completed
                        ? "text-text-tertiary line-through"
                        : "text-text-primary"
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deploy link */}
        {project.deployUrl && (
          <section className="mt-8">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Live site
            </h2>
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-md border-[0.5px] border-border bg-surface px-4 py-3 text-[14px] text-accent transition-colors hover:border-accent-muted hover:bg-accent-light"
            >
              <ExternalLink size={14} strokeWidth={1.5} />
              {project.deployUrl.replace(/^https?:\/\//, "")}
            </a>
          </section>
        )}

        {/* Shared by */}
        {project.user && (
          <div className="mt-8 flex items-center gap-4 rounded-lg border-[0.5px] border-border bg-surface p-6">
            {project.user.image ? (
              <img
                src={project.user.image}
                alt={project.user.name ?? ""}
                className="size-[40px] rounded-full"
              />
            ) : (
              <div className="flex size-[40px] items-center justify-center rounded-full bg-accent-light text-[14px] font-medium text-accent">
                {(project.user.name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[14px] font-medium text-text-primary">
                Shared by {project.user.name ?? project.user.username}
              </p>
              {project.user.username && (
                <Link
                  href={`/${project.user.username}`}
                  className="text-[12px] text-accent transition-colors hover:text-accent/80"
                >
                  View full profile →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-6 text-center">
          <Link
            href="/"
            className="font-mono text-[12px] text-text-tertiary transition-colors hover:text-text-primary"
          >
            Powered by TRACK<span className="text-accent">FLOW</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
