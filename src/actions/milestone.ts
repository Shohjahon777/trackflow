"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const milestoneSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  projectId: z.string().min(1, "Project is required"),
});

export async function createMilestone(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    title: formData.get("title") as string,
    projectId: formData.get("projectId") as string,
  };

  const parsed = milestoneSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const project = await db.project.findFirst({
    where: { id: parsed.data.projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  const maxOrder = await db.milestone.aggregate({
    where: { projectId: parsed.data.projectId },
    _max: { order: true },
  });

  const milestone = await db.milestone.create({
    data: {
      title: parsed.data.title,
      projectId: parsed.data.projectId,
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath(`/projects/${parsed.data.projectId}`);
  return { milestone };
}

export async function toggleMilestone(milestoneId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const milestone = await db.milestone.findFirst({
    where: { id: milestoneId, project: { userId: session.user.id } },
  });

  if (!milestone) {
    return { error: "Milestone not found" };
  }

  const updated = await db.milestone.update({
    where: { id: milestoneId },
    data: { completed: !milestone.completed },
  });

  revalidatePath(`/projects/${milestone.projectId}`);
  return { milestone: updated };
}

export async function deleteMilestone(milestoneId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const milestone = await db.milestone.findFirst({
    where: { id: milestoneId, project: { userId: session.user.id } },
  });

  if (!milestone) {
    return { error: "Milestone not found" };
  }

  await db.milestone.delete({ where: { id: milestoneId } });

  revalidatePath(`/projects/${milestone.projectId}`);
  return { success: true };
}
