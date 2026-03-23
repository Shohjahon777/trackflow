"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createTimeLogSchema } from "@/lib/validations";

export async function createTimeLog(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    description: formData.get("description") as string,
    hours: formData.get("hours") as string,
    minutes: formData.get("minutes") as string,
    cost: formData.get("cost") as string,
    date: formData.get("date") as string,
    projectId: formData.get("projectId") as string,
  };

  const parsed = createTimeLogSchema.safeParse(raw);
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

  const totalMinutes = parsed.data.hours * 60 + parsed.data.minutes;
  if (totalMinutes <= 0) {
    return { error: "Duration must be greater than zero" };
  }

  const costValue =
    parsed.data.cost !== "" && parsed.data.cost !== undefined
      ? parsed.data.cost
      : null;

  const timeLog = await db.timeLog.create({
    data: {
      description: parsed.data.description,
      duration: totalMinutes,
      cost: costValue,
      date: new Date(parsed.data.date),
      projectId: parsed.data.projectId,
    },
  });

  revalidatePath("/time-log");
  return { timeLog };
}

export async function deleteTimeLog(timeLogId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const timeLog = await db.timeLog.findFirst({
    where: {
      id: timeLogId,
      project: { userId: session.user.id },
    },
  });

  if (!timeLog) {
    return { error: "Time log not found" };
  }

  await db.timeLog.delete({ where: { id: timeLogId } });

  revalidatePath("/time-log");
  return { success: true };
}

export async function getTimeLogs() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db.timeLog.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: { select: { id: true, name: true, slug: true } } },
    orderBy: { date: "desc" },
  });
}

export async function getTimeLogStats() {
  const session = await auth();
  if (!session?.user?.id) {
    return { weekMinutes: 0, monthMinutes: 0, totalCost: 0 };
  }

  const now = new Date();

  // Start of current week (Monday)
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  // Start of current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [weekLogs, monthLogs, allLogs] = await Promise.all([
    db.timeLog.findMany({
      where: {
        project: { userId: session.user.id },
        date: { gte: weekStart },
      },
      select: { duration: true },
    }),
    db.timeLog.findMany({
      where: {
        project: { userId: session.user.id },
        date: { gte: monthStart },
      },
      select: { duration: true },
    }),
    db.timeLog.findMany({
      where: {
        project: { userId: session.user.id },
      },
      select: { cost: true },
    }),
  ]);

  const weekMinutes = weekLogs.reduce((sum, log) => sum + log.duration, 0);
  const monthMinutes = monthLogs.reduce((sum, log) => sum + log.duration, 0);
  const totalCost = allLogs.reduce(
    (sum, log) => sum + (log.cost ? Number(log.cost) : 0),
    0
  );

  return { weekMinutes, monthMinutes, totalCost };
}
