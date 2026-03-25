"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createDefaultBoard,
  createBoard,
  deleteBoard,
  createColumn,
  updateColumn,
  deleteColumn,
  moveTask,
  getBoardsForProject,
} from "@/actions/board";
import { createTask } from "@/actions/task";
import { TaskDetailSheet } from "@/components/project/task-detail-sheet";

type TaskTimeLog = {
  duration: number;
  date: Date;
  description: string;
};

type KanbanTask = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: Date | null;
  order: number;
  pomodoroCount: number;
};

type FullTask = KanbanTask & {
  description: string | null;
  pomodoroMinutes: number;
  timeLogs: TaskTimeLog[];
};

type Column = {
  id: string;
  title: string;
  color: string;
  order: number;
  tasks: KanbanTask[];
};

type Board = {
  id: string;
  name: string;
  columns: Column[];
};

type TaskKanbanBoardProps = {
  projectId: string;
  boards: Board[];
  allTasks: FullTask[];
};

const priorityColor = {
  HIGH: "bg-[#C26A6A]",
  MEDIUM: "bg-[#C4956A]",
  LOW: "bg-border",
} as const;

function isOverdue(date: Date | null): boolean {
  if (!date) return false;
  return new Date(date) < new Date(new Date().toDateString());
}

// ─── Sortable Task Card ───

function SortableTaskCard({
  task,
  onSelect,
}: {
  task: KanbanTask;
  onSelect: (task: KanbanTask) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-md border-[0.5px] border-border bg-background p-3 transition-shadow hover:shadow-sm",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 cursor-grab text-text-tertiary opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
        >
          <GripVertical size={12} />
        </button>
        <button
          onClick={() => onSelect(task)}
          className="min-w-0 flex-1 text-left text-[13px] text-text-primary transition-colors hover:text-accent"
        >
          {task.title}
        </button>
      </div>
      <div className="ml-5 mt-1.5 flex items-center gap-2">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            priorityColor[task.priority as keyof typeof priorityColor] ?? "bg-border"
          )}
          title={task.priority.toLowerCase() + " priority"}
        />
        {task.dueDate && (
          <span
            className={cn(
              "font-mono text-[10px]",
              isOverdue(task.dueDate) ? "text-[#C26A6A]" : "text-text-tertiary"
            )}
          >
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
        {task.pomodoroCount > 0 && (
          <span className="text-[10px]">
            {"🍅".repeat(Math.min(task.pomodoroCount, 3))}
            {task.pomodoroCount > 3 && (
              <span className="ml-0.5 font-mono text-text-tertiary">
                +{task.pomodoroCount - 3}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Task Card (for drag overlay) ───

function TaskCard({ task }: { task: KanbanTask }) {
  return (
    <div className="rounded-md border-[0.5px] border-accent/30 bg-background p-3 shadow-md">
      <div className="flex items-start gap-2">
        <GripVertical size={12} className="mt-0.5 text-text-tertiary" />
        <span className="text-[13px] text-text-primary">{task.title}</span>
      </div>
    </div>
  );
}

// ─── Column Component ───

function KanbanColumn({
  column,
  projectId,
  onSelectTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: Column;
  projectId: string;
  onSelectTask: (task: KanbanTask) => void;
  onEditColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) inputRef.current.focus();
  }, [isAdding]);

  function handleAddTask(formData: FormData) {
    startTransition(async () => {
      await createTask(formData);
      formRef.current?.reset();
      setIsAdding(false);
    });
  }

  function handleEditSubmit() {
    if (editTitle.trim() && editTitle !== column.title) {
      onEditColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  }

  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-lg border-[0.5px] border-border bg-surface">
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSubmit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            autoFocus
            className="flex-1 bg-transparent text-[12px] font-medium text-text-primary focus:outline-none"
          />
        ) : (
          <span className="flex-1 text-[12px] font-medium text-text-primary">
            {column.title}
          </span>
        )}
        <span className="font-mono text-[10px] text-text-tertiary">
          {column.tasks.length}
        </span>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex size-[20px] items-center justify-center rounded text-text-tertiary transition-colors hover:text-text-primary"
          >
            <MoreHorizontal size={12} />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-[140px] rounded-md border-[0.5px] border-border bg-background py-1 shadow-lg">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setIsEditing(true);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-text-secondary hover:bg-surface"
                >
                  <Pencil size={12} />
                  Rename
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteColumn(column.id);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-[12px] text-[#C26A6A] hover:bg-surface"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 space-y-1.5 overflow-y-auto px-2 pb-2" style={{ maxHeight: "calc(100vh - 340px)" }}>
        <SortableContext
          items={column.tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onSelect={onSelectTask}
            />
          ))}
        </SortableContext>

        {column.tasks.length === 0 && (
          <div className="rounded-md border border-dashed border-border/60 py-6 text-center text-[11px] text-text-tertiary">
            Drop tasks here
          </div>
        )}
      </div>

      {/* Add task */}
      <div className="border-t-[0.5px] border-border px-2 py-2">
        {isAdding ? (
          <form ref={formRef} action={handleAddTask}>
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="status" value="TODO" />
            <input
              ref={inputRef}
              name="title"
              required
              placeholder="Task title..."
              className="w-full rounded-md border-[0.5px] border-border bg-background px-2.5 py-1.5 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsAdding(false);
              }}
            />
            <div className="mt-1.5 flex gap-1">
              <button
                type="submit"
                disabled={isPending}
                className="rounded bg-accent px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded px-2 py-1 text-[11px] text-text-tertiary hover:text-text-primary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[12px] text-text-tertiary transition-colors hover:bg-background hover:text-text-secondary"
          >
            <Plus size={12} />
            Add task
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Kanban Board ───

export function TaskKanbanBoard({
  projectId,
  boards: initialBoards,
  allTasks,
}: TaskKanbanBoardProps) {
  const [boards, setBoards] = useState(initialBoards);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(
    initialBoards[0]?.id ?? null
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const activeBoard = boards.find((b) => b.id === activeBoardId) ?? null;

  // Find the full task data for the detail sheet
  const selectedFullTask = selectedTask
    ? allTasks.find((t) => t.id === selectedTask.id) ?? null
    : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Find task in any column
  function findTask(taskId: string): KanbanTask | null {
    if (!activeBoard) return null;
    for (const col of activeBoard.columns) {
      const task = col.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return null;
  }

  function findColumnByTaskId(taskId: string): string | null {
    if (!activeBoard) return null;
    for (const col of activeBoard.columns) {
      if (col.tasks.some((t) => t.id === taskId)) return col.id;
    }
    return null;
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveTaskId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !activeBoard) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColId = findColumnByTaskId(activeId);
    // Check if over is a column or a task
    let overColId = activeBoard.columns.find((c) => c.id === overId)?.id;
    if (!overColId) {
      overColId = findColumnByTaskId(overId) ?? undefined;
    }

    if (!activeColId || !overColId || activeColId === overColId) return;

    // Move task between columns optimistically
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== activeBoardId) return b;
        return {
          ...b,
          columns: b.columns.map((col) => {
            if (col.id === activeColId) {
              return {
                ...col,
                tasks: col.tasks.filter((t) => t.id !== activeId),
              };
            }
            if (col.id === overColId) {
              const task = findTask(activeId);
              if (!task) return col;
              const overIndex = col.tasks.findIndex((t) => t.id === overId);
              const newTasks = [...col.tasks];
              if (overIndex >= 0) {
                newTasks.splice(overIndex, 0, task);
              } else {
                newTasks.push(task);
              }
              return { ...col, tasks: newTasks };
            }
            return col;
          }),
        };
      })
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTaskId(null);
    const { active, over } = event;
    if (!over || !activeBoard) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColId = findColumnByTaskId(activeId);
    let overColId = activeBoard.columns.find((c) => c.id === overId)?.id;
    if (!overColId) {
      overColId = findColumnByTaskId(overId) ?? undefined;
    }

    if (!activeColId || !overColId) return;

    if (activeColId === overColId) {
      // Reorder within same column
      const col = activeBoard.columns.find((c) => c.id === activeColId);
      if (!col) return;
      const oldIndex = col.tasks.findIndex((t) => t.id === activeId);
      const newIndex = col.tasks.findIndex((t) => t.id === overId);
      if (oldIndex !== newIndex) {
        const newTasks = arrayMove(col.tasks, oldIndex, newIndex);
        setBoards((prev) =>
          prev.map((b) => {
            if (b.id !== activeBoardId) return b;
            return {
              ...b,
              columns: b.columns.map((c) =>
                c.id === activeColId ? { ...c, tasks: newTasks } : c
              ),
            };
          })
        );
      }
    }

    // Find final position and persist
    const finalCol = boards
      .find((b) => b.id === activeBoardId)
      ?.columns.find((c) => c.id === overColId);
    const finalIndex = finalCol?.tasks.findIndex((t) => t.id === activeId) ?? 0;

    startTransition(async () => {
      await moveTask(activeId, overColId!, finalIndex);
    });
  }

  function handleCreateBoard() {
    if (!newBoardName.trim()) return;
    startTransition(async () => {
      const result = await createBoard(projectId, newBoardName.trim());
      if (result.board) {
        const newBoard = {
          id: result.board.id,
          name: result.board.name,
          columns: result.board.columns.map((c) => ({ ...c, tasks: [] })),
        };
        setBoards((prev) => [...prev, newBoard]);
        setActiveBoardId(newBoard.id);
      }
      setIsCreatingBoard(false);
      setNewBoardName("");
    });
  }

  function handleDeleteBoard(boardId: string) {
    startTransition(async () => {
      await deleteBoard(boardId);
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      if (activeBoardId === boardId) {
        setActiveBoardId(boards.find((b) => b.id !== boardId)?.id ?? null);
      }
    });
  }

  function handleAddColumn() {
    if (!newColumnTitle.trim() || !activeBoardId) return;
    startTransition(async () => {
      const result = await createColumn(activeBoardId!, newColumnTitle.trim());
      if (result.column) {
        setBoards((prev) =>
          prev.map((b) => {
            if (b.id !== activeBoardId) return b;
            return {
              ...b,
              columns: [
                ...b.columns,
                { ...result.column!, tasks: [] },
              ],
            };
          })
        );
      }
      setIsAddingColumn(false);
      setNewColumnTitle("");
    });
  }

  function handleEditColumn(columnId: string, title: string) {
    startTransition(async () => {
      await updateColumn(columnId, { title });
      setBoards((prev) =>
        prev.map((b) => ({
          ...b,
          columns: b.columns.map((c) =>
            c.id === columnId ? { ...c, title } : c
          ),
        }))
      );
    });
  }

  function handleDeleteColumn(columnId: string) {
    startTransition(async () => {
      await deleteColumn(columnId);
      setBoards((prev) =>
        prev.map((b) => ({
          ...b,
          columns: b.columns.filter((c) => c.id !== columnId),
        }))
      );
    });
  }

  const draggedTask = activeTaskId ? findTask(activeTaskId) : null;

  // Auto-create default board if none exist
  useEffect(() => {
    if (boards.length === 0) {
      startTransition(async () => {
        const result = await createDefaultBoard(projectId);
        if (result.board) {
          // Refetch boards to get tasks assigned to columns
          const freshBoards = await getBoardsForProject(projectId);
          setBoards(freshBoards as Board[]);
          setActiveBoardId(freshBoards[0]?.id ?? null);
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (boards.length === 0 && isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-[13px] text-text-tertiary">
          Setting up your board...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Task detail sheet */}
      {selectedFullTask && (
        <TaskDetailSheet
          task={selectedFullTask}
          projectId={projectId}
          open={!!selectedFullTask}
          onOpenChange={(open) => {
            if (!open) setSelectedTask(null);
          }}
        />
      )}

      {/* Board tabs */}
      <div className="mb-4 flex items-center gap-2 border-b-[0.5px] border-border pb-2">
        {boards.map((board) => (
          <div key={board.id} className="group flex items-center">
            <button
              onClick={() => setActiveBoardId(board.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors",
                activeBoardId === board.id
                  ? "bg-accent-light text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {board.name}
            </button>
            {boards.length > 1 && (
              <button
                onClick={() => handleDeleteBoard(board.id)}
                className="ml-0.5 hidden text-text-tertiary hover:text-[#C26A6A] group-hover:inline-flex"
                title="Delete board"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}

        {isCreatingBoard ? (
          <div className="flex items-center gap-1">
            <input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
                if (e.key === "Escape") setIsCreatingBoard(false);
              }}
              autoFocus
              placeholder="Board name..."
              className="w-[120px] rounded-md border-[0.5px] border-border bg-surface px-2 py-1 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
            <button
              onClick={handleCreateBoard}
              className="rounded bg-accent px-2 py-1 text-[10px] font-medium text-white"
            >
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingBoard(true)}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-[12px] text-text-tertiary transition-colors hover:text-text-secondary"
          >
            <Plus size={12} />
            New board
          </button>
        )}
      </div>

      {/* Kanban columns */}
      {activeBoard && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-3 overflow-x-auto pb-4">
            {activeBoard.columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                projectId={projectId}
                onSelectTask={setSelectedTask}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
              />
            ))}

            {/* Add column */}
            {isAddingColumn ? (
              <div className="flex w-[300px] shrink-0 flex-col rounded-lg border border-dashed border-border bg-surface/50 p-3">
                <input
                  value={newColumnTitle}
                  onChange={(e) => setNewColumnTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddColumn();
                    if (e.key === "Escape") setIsAddingColumn(false);
                  }}
                  autoFocus
                  placeholder="Column title..."
                  className="rounded-md border-[0.5px] border-border bg-background px-2.5 py-1.5 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
                />
                <div className="mt-2 flex gap-1">
                  <button
                    onClick={handleAddColumn}
                    disabled={isPending}
                    className="rounded bg-accent px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-accent/90"
                  >
                    Add column
                  </button>
                  <button
                    onClick={() => setIsAddingColumn(false)}
                    className="rounded px-2.5 py-1 text-[11px] text-text-tertiary hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingColumn(true)}
                className="flex h-[40px] w-[300px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-[12px] text-text-tertiary transition-colors hover:border-text-tertiary hover:text-text-secondary"
              >
                <Plus size={14} />
                Add column
              </button>
            )}
          </div>

          <DragOverlay>
            {draggedTask ? <TaskCard task={draggedTask} /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
