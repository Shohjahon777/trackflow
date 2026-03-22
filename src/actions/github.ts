"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getUserOctokit,
  getUserRepos,
  getRepoCommits,
  getContributionData,
  type GitHubRepo,
  type GitHubCommit,
} from "@/lib/github";
import { revalidatePath } from "next/cache";

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const octokit = await getUserOctokit(session.user.id);
  if (!octokit) return [];

  return getUserRepos(octokit);
}

export async function fetchRepoCommits(
  repoFullName: string
): Promise<GitHubCommit[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const octokit = await getUserOctokit(session.user.id);
  if (!octokit) return [];

  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo) return [];

  return getRepoCommits(octokit, owner, repo);
}

export async function fetchActivityData(): Promise<
  { date: string; count: number }[]
> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const octokit = await getUserOctokit(session.user.id);
  if (!octokit) return [];

  const username = session.user.githubUsername;
  if (!username) return [];

  return getContributionData(octokit, username);
}

export async function linkRepoToProject(
  projectId: string,
  repoUrl: string
) {
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
    data: { repoUrl },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  return { success: true };
}

export async function detectStaleProjects() {
  const session = await auth();
  if (!session?.user?.id) return;

  const octokit = await getUserOctokit(session.user.id);
  if (!octokit) return;

  const projects = await db.project.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      repoUrl: { not: null },
    },
  });

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  for (const project of projects) {
    if (!project.repoUrl) continue;

    try {
      // Extract owner/repo from URL
      const match = project.repoUrl.match(
        /github\.com\/([^/]+)\/([^/]+)/
      );
      if (!match) continue;

      const [, owner, repo] = match;
      const commits = await getRepoCommits(octokit, owner, repo, 1);

      if (
        commits.length === 0 ||
        new Date(commits[0].date) < threeDaysAgo
      ) {
        await db.project.update({
          where: { id: project.id },
          data: { status: "STALE" },
        });
      }
    } catch {
      // Skip if we can't access the repo
    }
  }

  revalidatePath("/projects");
}
