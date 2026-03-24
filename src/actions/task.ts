"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTaskSchema, updateTaskSchema } from "@/lib/validations";

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    status: (formData.get("status") as string) || "TODO",
    priority: (formData.get("priority") as string) || "MEDIUM",
    dueDate: (formData.get("dueDate") as string) || undefined,
    projectId: formData.get("projectId") as string,
  };

  const parsed = createTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const project = await db.project.findFirst({
    where: { id: parsed.data.projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  const maxOrder = await db.task.aggregate({
    where: { projectId: parsed.data.projectId },
    _max: { order: true },
  });

  const task = await db.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      status: parsed.data.status as "TODO" | "IN_PROGRESS" | "DONE",
      priority: parsed.data.priority as "LOW" | "MEDIUM" | "HIGH",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      projectId: parsed.data.projectId,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
  return { task };
}

export async function updateTask(taskId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const task = await db.task.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });

  if (!task) {
    return { error: "Task not found" };
  }

  const raw: Record<string, unknown> = {};
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;

  if (title) raw.title = title;
  if (description !== null) raw.description = description || undefined;
  if (status) raw.status = status;
  if (priority) raw.priority = priority;
  if (dueDate) raw.dueDate = dueDate;

  const parsed = updateTaskSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data: {
      ...parsed.data,
      status: parsed.data.status as "TODO" | "IN_PROGRESS" | "DONE" | undefined,
      priority: parsed.data.priority as "LOW" | "MEDIUM" | "HIGH" | undefined,
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : undefined,
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { task: updated };
}

export async function toggleTaskStatus(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const task = await db.task.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });

  if (!task) {
    return { error: "Task not found" };
  }

  // Cycle: TODO -> IN_PROGRESS -> DONE -> TODO
  const nextStatus = {
    TODO: "IN_PROGRESS",
    IN_PROGRESS: "DONE",
    DONE: "TODO",
  } as const;

  const updated = await db.task.update({
    where: { id: taskId },
    data: { status: nextStatus[task.status] },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { task: updated };
}

export async function updateTaskFields(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string | null;
    pomodoroMinutes?: number;
  }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const task = await db.task.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });

  if (!task) {
    return { error: "Task not found" };
  }

  const parsed = updateTaskSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await db.task.update({
    where: { id: taskId },
    data: {
      ...(parsed.data.title && { title: parsed.data.title }),
      ...(parsed.data.description !== undefined && { description: parsed.data.description || null }),
      ...(parsed.data.status && { status: parsed.data.status as "TODO" | "IN_PROGRESS" | "DONE" }),
      ...(parsed.data.priority && { priority: parsed.data.priority as "LOW" | "MEDIUM" | "HIGH" }),
      ...(parsed.data.dueDate !== undefined && {
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      }),
      ...(parsed.data.pomodoroMinutes && { pomodoroMinutes: parsed.data.pomodoroMinutes }),
    },
  });

  revalidatePath(`/projects/${task.projectId}`);
  return { task: updated };
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const task = await db.task.findFirst({
    where: { id: taskId, project: { userId: session.user.id } },
  });

  if (!task) {
    return { error: "Task not found" };
  }

  await db.task.delete({ where: { id: taskId } });

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}
