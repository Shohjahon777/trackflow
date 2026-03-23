"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { checkLimit } from "@/lib/plan";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["GENERAL", "ADR", "PROMPT"]).default("GENERAL"),
  projectId: z.string().min(1, "Project is required"),
});

const updateNoteSchema = createNoteSchema.partial().omit({ projectId: true });

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    type: (formData.get("type") as string) || "GENERAL",
    projectId: formData.get("projectId") as string,
  };

  const parsed = createNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Verify project ownership
  const project = await db.project.findFirst({
    where: { id: parsed.data.projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  // Check plan limit for notes per project
  const noteCount = await db.note.count({
    where: { projectId: parsed.data.projectId },
  });
  const limit = await checkLimit(session.user.id, "notesPerProject", noteCount);
  if (!limit.allowed) {
    return {
      error: `You've reached the limit of ${limit.limit} notes per project on the Free plan. Upgrade to Pro for unlimited notes.`,
    };
  }

  const note = await db.note.create({
    data: parsed.data,
  });

  revalidatePath("/brain");
  revalidatePath(`/projects/${parsed.data.projectId}`);
  return { note };
}

export async function updateNote(noteId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  // Verify ownership through project
  const note = await db.note.findFirst({
    where: { id: noteId, project: { userId: session.user.id } },
  });

  if (!note) {
    return { error: "Note not found" };
  }

  const raw: Record<string, unknown> = {};
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const type = formData.get("type") as string;

  if (title) raw.title = title;
  if (content) raw.content = content;
  if (type) raw.type = type;

  const parsed = updateNoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const updated = await db.note.update({
    where: { id: noteId },
    data: parsed.data,
  });

  revalidatePath("/brain");
  return { note: updated };
}

export async function deleteNote(noteId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const note = await db.note.findFirst({
    where: { id: noteId, project: { userId: session.user.id } },
  });

  if (!note) {
    return { error: "Note not found" };
  }

  await db.note.delete({ where: { id: noteId } });

  revalidatePath("/brain");
  return { success: true };
}

export async function getNotes() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db.note.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: { select: { id: true, name: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getUserProjects() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db.project.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}
