"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function generateShareToken(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  const token = randomBytes(24).toString("hex");

  const updated = await db.project.update({
    where: { id: projectId },
    data: { shareToken: token },
  });

  revalidatePath("/shares");
  revalidatePath(`/projects/${projectId}`);
  return { token: updated.shareToken };
}

export async function revokeShareToken(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  await db.project.update({
    where: { id: projectId },
    data: { shareToken: null },
  });

  revalidatePath("/shares");
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function getSharedProjects() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db.project.findMany({
    where: {
      userId: session.user.id,
      shareToken: { not: null },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      shareToken: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectByShareToken(token: string) {
  return db.project.findUnique({
    where: { shareToken: token },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      status: true,
      stack: true,
      deployUrl: true,
      updatedAt: true,
      user: {
        select: { name: true, username: true, image: true },
      },
    },
  });
}
