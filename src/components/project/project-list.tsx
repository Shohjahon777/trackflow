import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { ProjectStatus } from "@prisma/client";

type Project = {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  stack: string[];
  updatedAt: Date;
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

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="overflow-hidden rounded-md border-[0.5px] border-border">
      {/* Header */}
      <div className="flex h-[36px] items-center border-b-[0.5px] border-border px-4 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
        <span className="flex-1">Name</span>
        <span className="w-24 text-center">Status</span>
        <span className="w-40">Stack</span>
        <span className="w-28 text-right font-mono">Updated</span>
      </div>

      {/* Rows */}
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="flex h-[40px] items-center border-b-[0.5px] border-border px-4 transition-colors duration-[120ms] last:border-b-0 hover:bg-fog dark:hover:bg-surface-hover"
        >
          <span className="flex-1 truncate text-[14px] font-medium text-text-primary">
            {project.name}
          </span>
          <span className="flex w-24 justify-center">
            <Badge variant={statusVariant[project.status]}>
              {statusLabel[project.status]}
            </Badge>
          </span>
          <span className="flex w-40 gap-1 overflow-hidden">
            {project.stack.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </span>
          <span className="w-28 text-right font-mono text-[12px] text-text-tertiary">
            {project.updatedAt.toLocaleDateString()}
          </span>
        </Link>
      ))}
    </div>
  );
}
