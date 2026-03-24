"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function completePomodoroSession(taskId: string) {
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

  // Increment pomodoro count and create a time log in one transaction
  await db.$transaction([
    db.task.update({
      where: { id: taskId },
      data: { pomodoroCount: { increment: 1 } },
    }),
    db.timeLog.create({
      data: {
        description: `Pomodoro session — ${task.title}`,
        duration: task.pomodoroMinutes,
        date: new Date(),
        taskId: task.id,
        projectId: task.projectId,
      },
    }),
  ]);

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}
