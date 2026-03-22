"use client";

import { useQueryState } from "nuqs";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectList } from "@/components/project/project-list";
import { KanbanBoard } from "@/components/project/kanban-board";
import type { Project } from "@prisma/client";

export function ProjectsView({ projects }: { projects: Project[] }) {
  const [view] = useQueryState("view", { defaultValue: "grid" });

  if (view === "list") {
    return <ProjectList projects={projects} />;
  }

  if (view === "kanban") {
    return <KanbanBoard projects={projects} />;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
