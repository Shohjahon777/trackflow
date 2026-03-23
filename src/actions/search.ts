"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkPlan } from "@/lib/plan";

type SearchResult = {
  type: "project" | "note";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export async function searchAll(query: string): Promise<SearchResult[]> {
  const session = await auth();
  if (!session?.user?.id || !query.trim()) return [];

  const userId = session.user.id;
  const plan = await checkPlan(userId);
  const term = query.trim();

  const results: SearchResult[] = [];

  // Always search projects (free + pro)
  const projects = await db.project.findMany({
    where: {
      userId,
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
        { stack: { has: term } },
      ],
    },
    select: { id: true, name: true, status: true, stack: true },
    take: 5,
  });

  for (const p of projects) {
    results.push({
      type: "project",
      id: p.id,
      title: p.name,
      subtitle: `${p.status.toLowerCase()} · ${p.stack.slice(0, 3).join(", ")}`,
      href: `/projects/${p.id}`,
    });
  }

  // Search notes only for Pro users
  if (plan.isPro) {
    const notes = await db.note.findMany({
      where: {
        project: { userId },
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { content: { contains: term, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        type: true,
        project: { select: { name: true, id: true } },
      },
      take: 5,
    });

    for (const n of notes) {
      results.push({
        type: "note",
        id: n.id,
        title: n.title,
        subtitle: `${n.type.toLowerCase()} in ${n.project.name}`,
        href: `/projects/${n.project.id}`,
      });
    }
  }

  return results;
}
