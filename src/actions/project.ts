"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations";
import { checkLimit } from "@/lib/plan";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    repoUrl: (formData.get("repoUrl") as string) || undefined,
    deployUrl: (formData.get("deployUrl") as string) || undefined,
    stack: (formData.get("stack") as string)
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [],
    category: (formData.get("category") as string) || "PERSONAL",
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check plan limit
  const projectCount = await db.project.count({
    where: { userId: session.user.id },
  });
  const limit = await checkLimit(session.user.id, "projects", projectCount);
  if (!limit.allowed) {
    return {
      error: `You've reached the limit of ${limit.limit} projects on the Free plan. Upgrade to Pro for unlimited projects.`,
    };
  }

  // Check slug uniqueness for this user
  const existing = await db.project.findUnique({
    where: {
      userId_slug: {
        userId: session.user.id,
        slug: parsed.data.slug,
      },
    },
  });

  if (existing) {
    return { error: "You already have a project with this slug" };
  }

  const project = await db.project.create({
    data: {
      ...parsed.data,
      repoUrl: parsed.data.repoUrl || null,
      deployUrl: parsed.data.deployUrl || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/overview");
  return { project };
}

export async function updateProject(projectId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  // Verify ownership
  const project = await db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    return { error: "Project not found" };
  }

  const raw: Record<string, unknown> = {};
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const repoUrl = formData.get("repoUrl") as string;
  const deployUrl = formData.get("deployUrl") as string;
  const stack = formData.get("stack") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;

  if (name) raw.name = name;
  if (slug) raw.slug = slug;
  if (description !== null) raw.description = description || undefined;
  if (repoUrl !== null) raw.repoUrl = repoUrl || undefined;
  if (deployUrl !== null) raw.deployUrl = deployUrl || undefined;
  if (stack) raw.stack = stack.split(",").map((s) => s.trim()).filter(Boolean);
  if (category) raw.category = category;

  const parsed = updateProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check slug uniqueness if slug changed
  if (parsed.data.slug && parsed.data.slug !== project.slug) {
    const slugTaken = await db.project.findUnique({
      where: {
        userId_slug: {
          userId: session.user.id,
          slug: parsed.data.slug,
        },
      },
    });
    if (slugTaken) {
      return { error: "You already have a project with this slug" };
    }
  }

  const updated = await db.project.update({
    where: { id: projectId },
    data: {
      ...parsed.data,
      repoUrl: parsed.data.repoUrl || null,
      deployUrl: parsed.data.deployUrl || null,
      ...(status ? { status: status as "ACTIVE" | "DEPLOYED" | "STALE" | "ARCHIVED" | "PAUSED" } : {}),
    },
  });

  revalidatePath("/projects");
  revalidatePath("/overview");
  revalidatePath(`/projects/${projectId}`);
  return { project: updated };
}

export async function deleteProject(projectId: string) {
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

  await db.project.delete({ where: { id: projectId } });

  revalidatePath("/projects");
  revalidatePath("/overview");
  return { success: true };
}

export async function getProjects() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  return db.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    include: { notes: { orderBy: { updatedAt: "desc" } } },
  });
}
