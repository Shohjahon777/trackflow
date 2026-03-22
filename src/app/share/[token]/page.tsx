import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[640px] px-6 py-16">
        {/* Project header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-medium leading-[1.2] text-text-primary">
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
                {project.description}
              </p>
            )}
          </div>
          <Badge variant={statusVariant[project.status]}>
            {project.status.toLowerCase()}
          </Badge>
        </div>

        {/* Tech stack */}
        {project.stack.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Tech stack
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <Badge key={tech} variant="tech">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Deploy link */}
        {project.deployUrl && (
          <div className="mt-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Live site
            </h2>
            <a
              href={project.deployUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-[14px] text-accent transition-colors hover:text-accent/80"
            >
              <ExternalLink size={14} />
              {project.deployUrl}
            </a>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Status
            </span>
            <p className="mt-1 text-[14px] font-medium text-text-primary">
              {project.status.charAt(0) + project.status.slice(1).toLowerCase()}
            </p>
          </div>
          <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Last updated
            </span>
            <p className="mt-1 font-mono text-[14px] text-text-primary">
              {project.updatedAt.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Shared by */}
        {project.user && (
          <div className="mt-8 flex items-center gap-3 rounded-md border-[0.5px] border-border bg-surface p-4">
            {project.user.image ? (
              <img
                src={project.user.image}
                alt={project.user.name ?? ""}
                className="size-[32px] rounded-full"
              />
            ) : (
              <div className="flex size-[32px] items-center justify-center rounded-full bg-accent-light text-[12px] font-medium text-accent">
                {(project.user.name ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[13px] font-medium text-text-primary">
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
        <footer className="mt-12 border-t border-border pt-6 text-center">
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
