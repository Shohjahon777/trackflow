import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus, ProjectCategory } from "@prisma/client";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    status: ProjectStatus;
    stack: string[];
    repoUrl: string | null;
    deployUrl: string | null;
    category: ProjectCategory;
    updatedAt: Date;
  };
};

const statusVariant: Record<ProjectStatus, "success" | "info" | "warning" | "danger" | "neutral"> = {
  DEPLOYED: "success",
  ACTIVE: "info",
  STALE: "warning",
  ARCHIVED: "neutral",
  PAUSED: "neutral",
};

const statusLabel: Record<ProjectStatus, string> = {
  DEPLOYED: "deployed",
  ACTIVE: "active",
  STALE: "stale",
  ARCHIVED: "archived",
  PAUSED: "paused",
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col gap-3 rounded-md border-[0.5px] border-border bg-background p-4 transition-colors duration-[120ms] hover:bg-surface-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-text-primary">
            {project.name}
          </h3>
          {project.description && (
            <p className="mt-0.5 line-clamp-2 text-[12px] text-text-secondary">
              {project.description}
            </p>
          )}
        </div>
        <Badge variant={statusVariant[project.status]}>
          {statusLabel[project.status]}
        </Badge>
      </div>

      {/* Stack */}
      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.stack.map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 text-[12px] text-text-tertiary">
        {project.repoUrl && (
          <span className="flex items-center gap-1">
            <GitBranch size={12} />
            <span className="font-mono">repo</span>
          </span>
        )}
        {project.deployUrl && (
          <span className="flex items-center gap-1">
            <ExternalLink size={12} />
            <span className="font-mono">live</span>
          </span>
        )}
        <span className="ml-auto font-mono">
          {project.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
}
