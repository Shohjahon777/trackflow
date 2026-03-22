import { Suspense } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectList } from "@/components/project/project-list";
import { ProjectGridSkeleton } from "@/components/project/project-card-skeleton";
import { ViewToggle } from "@/components/project/view-toggle";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { ProjectsView } from "@/components/project/projects-view";
import { getProjects } from "@/actions/project";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-[1280px]">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
            Projects
          </h1>
          <p className="mt-1 text-[14px] text-text-secondary">
            Manage all your projects from one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle />
          <CreateProjectDialog />
        </div>
      </div>

      {/* Projects */}
      <div className="mt-6">
        {projects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start tracking your work."
            action={<CreateProjectDialog />}
          />
        ) : (
          <ProjectsView projects={projects} />
        )}
      </div>
    </div>
  );
}
