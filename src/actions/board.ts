"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const DEFAULT_COLUMNS = [
  { title: "Todo", color: "#9C9C95", order: 0 },
  { title: "In progress", color: "#5B8CA8", order: 1 },
  { title: "Done", color: "#3D8B6E", order: 2 },
];

async function verifyProjectOwnership(projectId: string, userId: string) {
  return db.project.findFirst({
    where: { id: projectId, userId },
    select: { id: true },
  });
}

async function verifyBoardOwnership(boardId: string, userId: string) {
  return db.board.findFirst({
    where: { id: boardId, project: { userId } },
    select: { id: true, projectId: true },
  });
}

async function verifyColumnOwnership(columnId: string, userId: string) {
  return db.boardColumn.findFirst({
    where: { id: columnId, board: { project: { userId } } },
    select: { id: true, boardId: true, board: { select: { projectId: true } } },
  });
}

export async function createBoard(projectId: string, name: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const project = await verifyProjectOwnership(projectId, session.user.id);
  if (!project) return { error: "Project not found" };

  const board = await db.board.create({
    data: {
      name,
      projectId,
      columns: {
        create: DEFAULT_COLUMNS,
      },
    },
    include: { columns: { orderBy: { order: "asc" } } },
  });

  revalidatePath(`/projects/${projectId}`);
  return { board };
}

export async function createDefaultBoard(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const project = await verifyProjectOwnership(projectId, session.user.id);
  if (!project) return { error: "Project not found" };

  // Check if board already exists
  const existing = await db.board.findFirst({
    where: { projectId },
    select: { id: true },
  });
  if (existing) return { error: "Board already exists" };

  const board = await db.board.create({
    data: {
      name: "Default",
      projectId,
      columns: {
        create: DEFAULT_COLUMNS,
      },
    },
    include: { columns: { orderBy: { order: "asc" } } },
  });

  // Assign existing tasks to columns based on their status
  const statusToColumnTitle: Record<string, string> = {
    TODO: "Todo",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  };

  const columnMap = new Map(board.columns.map((c) => [c.title, c.id]));

  const tasks = await db.task.findMany({
    where: { projectId },
    select: { id: true, status: true },
  });

  for (const task of tasks) {
    const colTitle = statusToColumnTitle[task.status] ?? "Todo";
    const columnId = columnMap.get(colTitle);
    if (columnId) {
      await db.task.update({
        where: { id: task.id },
        data: { boardColumnId: columnId },
      });
    }
  }

  revalidatePath(`/projects/${projectId}`);
  return { board };
}

export async function updateBoard(boardId: string, name: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const board = await verifyBoardOwnership(boardId, session.user.id);
  if (!board) return { error: "Board not found" };

  const updated = await db.board.update({
    where: { id: boardId },
    data: { name },
  });

  revalidatePath(`/projects/${board.projectId}`);
  return { board: updated };
}

export async function deleteBoard(boardId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const board = await verifyBoardOwnership(boardId, session.user.id);
  if (!board) return { error: "Board not found" };

  // Unassign tasks from this board's columns first
  await db.task.updateMany({
    where: { boardColumn: { boardId } },
    data: { boardColumnId: null },
  });

  await db.board.delete({ where: { id: boardId } });

  revalidatePath(`/projects/${board.projectId}`);
  return { success: true };
}

export async function createColumn(
  boardId: string,
  title: string,
  color?: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const board = await verifyBoardOwnership(boardId, session.user.id);
  if (!board) return { error: "Board not found" };

  const maxOrder = await db.boardColumn.aggregate({
    where: { boardId },
    _max: { order: true },
  });

  const column = await db.boardColumn.create({
    data: {
      title,
      color: color ?? "#6366A0",
      order: (maxOrder._max.order ?? -1) + 1,
      boardId,
    },
  });

  revalidatePath(`/projects/${board.projectId}`);
  return { column };
}

export async function updateColumn(
  columnId: string,
  data: { title?: string; color?: string }
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const column = await verifyColumnOwnership(columnId, session.user.id);
  if (!column) return { error: "Column not found" };

  const updated = await db.boardColumn.update({
    where: { id: columnId },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.color !== undefined && { color: data.color }),
    },
  });

  revalidatePath(`/projects/${column.board.projectId}`);
  return { column: updated };
}

export async function deleteColumn(columnId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const column = await verifyColumnOwnership(columnId, session.user.id);
  if (!column) return { error: "Column not found" };

  // Unassign tasks from this column
  await db.task.updateMany({
    where: { boardColumnId: columnId },
    data: { boardColumnId: null },
  });

  await db.boardColumn.delete({ where: { id: columnId } });

  revalidatePath(`/projects/${column.board.projectId}`);
  return { success: true };
}

export async function moveTask(
  taskId: string,
  columnId: string,
  order: number
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const task = await db.task.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
    select: { id: true, projectId: true },
  });
  if (!task) return { error: "Task not found" };

  await db.task.update({
    where: { id: taskId },
    data: { boardColumnId: columnId, order },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}

export async function reorderColumns(boardId: string, columnIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const board = await verifyBoardOwnership(boardId, session.user.id);
  if (!board) return { error: "Board not found" };

  await db.$transaction(
    columnIds.map((id, index) =>
      db.boardColumn.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  revalidatePath(`/projects/${board.projectId}`);
  return { success: true };
}

export async function getBoardsForProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.board.findMany({
    where: { projectId, project: { userId: session.user.id } },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              status: true,
              priority: true,
              dueDate: true,
              order: true,
              pomodoroCount: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
