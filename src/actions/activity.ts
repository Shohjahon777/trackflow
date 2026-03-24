"use server";

import { db } from "@/lib/db";

type ActivityDay = { date: string; count: number };

export async function getActivityData(userId: string): Promise<ActivityDay[]> {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Get all user's project IDs
  const projects = await db.project.findMany({
    where: { userId },
    select: { id: true },
  });

  const projectIds = projects.map((p) => p.id);

  if (projectIds.length === 0) return [];

  // Fetch completed tasks, time logs, and notes in parallel
  const [tasks, timeLogs, notes] = await Promise.all([
    db.task.findMany({
      where: {
        projectId: { in: projectIds },
        status: "DONE",
        updatedAt: { gte: oneYearAgo },
      },
      select: { updatedAt: true },
    }),
    db.timeLog.findMany({
      where: {
        projectId: { in: projectIds },
        date: { gte: oneYearAgo },
      },
      select: { date: true },
    }),
    db.note.findMany({
      where: {
        projectId: { in: projectIds },
        createdAt: { gte: oneYearAgo },
      },
      select: { createdAt: true },
    }),
  ]);

  // Aggregate by date
  const counts = new Map<string, number>();

  function addDate(d: Date) {
    const key = d.toISOString().split("T")[0];
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  for (const t of tasks) addDate(t.updatedAt);
  for (const l of timeLogs) addDate(l.date);
  for (const n of notes) addDate(n.createdAt);

  return Array.from(counts.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
