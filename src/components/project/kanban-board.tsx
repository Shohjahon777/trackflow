"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { updateProject } from "@/actions/project";
import type { Project, ProjectStatus } from "@prisma/client";

const columns: { id: ProjectStatus; label: string; variant: "info" | "success" | "warning" | "neutral" }[] = [
  { id: "ACTIVE", label: "Active", variant: "info" },
  { id: "DEPLOYED", label: "Deployed", variant: "success" },
  { id: "PAUSED", label: "Paused", variant: "neutral" },
  { id: "STALE", label: "Stale", variant: "warning" },
  { id: "ARCHIVED", label: "Archived", variant: "neutral" },
];

export function KanbanBoard({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const activeProject = items.find((p) => p.id === activeId);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;
    const projectId = active.id as string;

    // Check if dropped on a column
    const targetColumn = columns.find((c) => c.id === overId);
    if (!targetColumn) return;

    const project = items.find((p) => p.id === projectId);
    if (!project || project.status === targetColumn.id) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, status: targetColumn.id } : p
      )
    );

    // Server update
    const formData = new FormData();
    formData.set("status", targetColumn.id);
    startTransition(async () => {
      const result = await updateProject(projectId, formData);
      if (result.error) {
        // Revert on error
        setItems(projects);
      }
      router.refresh();
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((col) => {
          const colProjects = items.filter((p) => p.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              column={col}
              projects={colProjects}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeProject ? <KanbanCardOverlay project={activeProject} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  column,
  projects,
}: {
  column: (typeof columns)[number];
  projects: Project[];
}) {
  const { setNodeRef, isOver } = useSortable({
    id: column.id,
    data: { type: "column" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-[240px] shrink-0 flex-col rounded-md border-[0.5px] border-border bg-surface transition-colors ${
        isOver ? "border-accent bg-accent-light/30" : ""
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[12px] font-medium text-text-secondary">
          {column.label}
        </span>
        <span className="font-mono text-[11px] text-text-tertiary">
          {projects.length}
        </span>
      </div>
      <SortableContext
        items={projects.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-1.5 px-2 pb-2 min-h-[80px]">
          {projects.map((project) => (
            <KanbanCard key={project.id} project={project} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function KanbanCard({ project }: { project: Project }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab rounded-md border-[0.5px] border-border bg-background p-2.5 active:cursor-grabbing"
    >
      <Link
        href={`/projects/${project.id}`}
        className="text-[13px] font-medium text-text-primary hover:text-accent"
        onClick={(e) => e.stopPropagation()}
      >
        {project.name}
      </Link>
      {project.description && (
        <p className="mt-0.5 line-clamp-1 text-[11px] text-text-tertiary">
          {project.description}
        </p>
      )}
      {project.stack.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-0.5">
          {project.stack.slice(0, 2).map((tech) => (
            <Badge key={tech} variant="tech" className="text-[8px] px-1 h-4">
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

function KanbanCardOverlay({ project }: { project: Project }) {
  return (
    <div className="w-[220px] rounded-md border-[0.5px] border-accent bg-background p-2.5 shadow-lg">
      <span className="text-[13px] font-medium text-text-primary">
        {project.name}
      </span>
      {project.stack.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-0.5">
          {project.stack.slice(0, 2).map((tech) => (
            <Badge key={tech} variant="tech" className="text-[8px] px-1 h-4">
              {tech}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
