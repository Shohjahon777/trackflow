import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject } from "@/actions/project";
import { EditProjectDialog } from "@/components/project/edit-project-dialog";
import { DeleteProjectButton } from "@/components/project/delete-project-button";
import type { ProjectStatus } from "@prisma/client";

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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[960px]">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to projects
      </Link>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[28px] font-medium leading-[1.2] text-text-primary">
              {project.name}
            </h1>
            <Badge variant={statusVariant[project.status]}>
              {statusLabel[project.status]}
            </Badge>
          </div>
          {project.description && (
            <p className="mt-2 max-w-[600px] text-[14px] leading-[1.7] text-text-secondary">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <EditProjectDialog project={project} />
          <DeleteProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </div>

      {/* Meta */}
      <div className="mt-6 flex flex-wrap gap-3">
        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="mt-4 flex gap-4">
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent"
          >
            <GitBranch size={14} />
            <span className="font-mono">Repository</span>
          </a>
        )}
        {project.deployUrl && (
          <a
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent"
          >
            <ExternalLink size={14} />
            <span className="font-mono">Live site</span>
          </a>
        )}
      </div>

      {/* Info grid */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Category
          </span>
          <p className="mt-1 text-[14px] font-medium text-text-primary">
            {project.category.charAt(0) + project.category.slice(1).toLowerCase().replace("_", " ")}
          </p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Created
          </span>
          <p className="mt-1 font-mono text-[14px] text-text-primary">
            {project.createdAt.toLocaleDateString()}
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

      {/* Notes section placeholder */}
      <div className="mt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Notes
        </h2>
        {project.notes.length === 0 ? (
          <p className="mt-3 text-[14px] text-text-secondary">
            No notes yet. Notes will be available in the Brain section.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {project.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-md border-[0.5px] border-border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-text-primary">
                    {note.title}
                  </span>
                  <Badge variant="neutral">{note.type.toLowerCase()}</Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-[12px] text-text-secondary">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
