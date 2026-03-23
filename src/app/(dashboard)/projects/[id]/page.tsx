import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getProject } from "@/actions/project";
import { getProjectCommits } from "@/lib/github";
import { EditProjectDialog } from "@/components/project/edit-project-dialog";
import { DeleteProjectButton } from "@/components/project/delete-project-button";
import { ProjectTabs } from "@/components/project/project-tabs";
import type { ProjectStatus } from "@prisma/client";
import { auth } from "@/lib/auth";

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

  // Fetch commits if repo is linked
  const session = await auth();
  let commits: { sha: string; message: string; date: string; url: string }[] = [];
  if (project.repoUrl && session?.user?.id) {
    try {
      commits = await getProjectCommits(session.user.id, project.repoUrl, 10);
    } catch {
      // GitHub data is optional
    }
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

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </div>
        )}
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

      {/* Tabs */}
      <div className="mt-8">
        <ProjectTabs
          project={{
            id: project.id,
            name: project.name,
            status: project.status,
            description: project.description,
            repoUrl: project.repoUrl,
            deployUrl: project.deployUrl,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          }}
          tasks={project.tasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            dueDate: t.dueDate,
            order: t.order,
            createdAt: t.createdAt,
          }))}
          milestones={project.milestones.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description,
            completed: m.completed,
            dueDate: m.dueDate,
            order: m.order,
          }))}
          timeLogs={project.timeLogs.map((t) => ({
            id: t.id,
            description: t.description,
            duration: t.duration,
            cost: t.cost,
            date: t.date,
          }))}
          notes={project.notes.map((n) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            type: n.type,
            updatedAt: n.updatedAt,
          }))}
          commits={commits}
        />
      </div>
    </div>
  );
}
