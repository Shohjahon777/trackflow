import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserOctokit, getUserRepos, getContributionData } from "@/lib/github";
import { DashboardOverview } from "@/components/dashboard/overview/dashboard-overview";

export const metadata: Metadata = {
  title: "Overview",
};

export default async function OverviewPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  // Fetch all data in parallel
  const [projects, notes, user, shareCount, noteCount, openTaskCount] = await Promise.all([
    db.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        milestones: { select: { completed: true } },
        _count: { select: { tasks: true } },
      },
    }),
    db.note.findMany({
      where: { project: { userId } },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { project: { select: { name: true } } },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { name: true, username: true, bio: true, githubUsername: true, createdAt: true },
    }),
    db.project.count({
      where: { userId, shareToken: { not: null } },
    }),
    db.note.count({
      where: { project: { userId } },
    }),
    db.task.count({
      where: { project: { userId }, status: { not: "DONE" } },
    }),
  ]);

  // GitHub data (non-blocking — gracefully degrade)
  let recentCommits: { sha: string; message: string; date: string; repo: string }[] = [];
  let weeklyCommitCount = 0;
  let activityData: { date: string; count: number }[] = [];

  try {
    const octokit = await getUserOctokit(userId);
    if (octokit && user?.githubUsername) {
      const [repos, activity] = await Promise.all([
        getUserRepos(octokit),
        getContributionData(octokit, user.githubUsername),
      ]);

      activityData = activity;

      // Get recent commits from top 3 most recently pushed repos
      const topRepos = repos.slice(0, 3);
      const commitPromises = topRepos.map(async (repo) => {
        try {
          const { data } = await octokit.repos.listCommits({
            owner: repo.full_name.split("/")[0],
            repo: repo.name,
            per_page: 5,
          });
          return data.map((c) => ({
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            date: c.commit.author?.date ?? "",
            repo: repo.name,
          }));
        } catch {
          return [];
        }
      });

      const allCommits = (await Promise.all(commitPromises)).flat();
      recentCommits = allCommits
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8);

      // Count commits in last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weeklyCommitCount = allCommits.filter(
        (c) => new Date(c.date) >= weekAgo
      ).length;
    }
  } catch {
    // GitHub data is optional
  }

  // Compute stats
  const activeProjects = projects.filter((p) => p.status === "ACTIVE" || p.status === "DEPLOYED");
  const deployedProjects = projects.filter((p) => p.deployUrl);
  const sharedProjects = projects.filter((p) => p.shareToken);

  // Streak: consecutive days with activity
  const today = new Date();
  const projectDays = projects
    .map((p) => p.updatedAt.toISOString().split("T")[0])
    .sort()
    .reverse();
  const uniqueDays = [...new Set(projectDays)];
  let streak = 0;
  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (uniqueDays[i] === expected.toISOString().split("T")[0]) {
      streak++;
    } else break;
  }

  // Onboarding state — derived from real data
  const isNewUser = projects.length === 0 && !user?.username;
  const onboarding = {
    hasUsername: !!user?.username,
    hasProject: projects.length > 0,
    hasNote: noteCount > 0,
    hasShare: shareCount > 0,
    hasTimeLog: false, // TODO: enable after prisma generate
    hasPublicProfile: !!user?.username && projects.length > 0,
  };

  return (
    <DashboardOverview
      userName={user?.name ?? session!.user!.name ?? ""}
      username={user?.username ?? null}
      isNewUser={isNewUser}
      onboarding={onboarding}
      stats={{
        activeProjects: activeProjects.length,
        totalProjects: projects.length,
        weeklyCommits: weeklyCommitCount,
        deployedCount: deployedProjects.length,
        streak,
        notesCount: notes.length,
        sharedCount: sharedProjects.length,
      }}
      openTasks={openTaskCount}
      projects={projects.slice(0, 6).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        stack: p.stack,
        deployUrl: p.deployUrl,
        updatedAt: p.updatedAt,
        milestonesDone: p.milestones.filter((m) => m.completed).length,
        milestonesTotal: p.milestones.length,
      }))}
      recentCommits={recentCommits}
      recentNotes={notes.map((n) => ({
        id: n.id,
        title: n.title,
        type: n.type,
        projectName: n.project.name,
        updatedAt: n.updatedAt,
      }))}
      activityData={activityData}
    />
  );
}
