import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserOctokit, getContributionData, getProjectCommits } from "@/lib/github";
import { getActivityData } from "@/actions/activity";
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
        tasks: { select: { status: true, updatedAt: true } },
        timeLogs: { select: { duration: true, date: true } },
        notes: { select: { createdAt: true } },
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

  // GitHub data — fetch commits from project-linked repos
  let recentCommits: { sha: string; message: string; date: string; repo: string }[] = [];
  let weeklyCommitCount = 0;
  const repoWarnings: Record<string, string> = {};

  try {
    // Get commits from all projects that have a linked GitHub repo
    const projectsWithRepo = projects.filter((p) => p.repoUrl);
    if (projectsWithRepo.length > 0) {
      const commitPromises = projectsWithRepo.slice(0, 5).map(async (p) => {
        try {
          // Fetch enough commits to accurately count a full week (30 covers ~5 commits/day)
          const result = await getProjectCommits(userId, p.repoUrl!, 30);

          // Track repo issues per project
          if (result.repoStatus === "not_found") {
            repoWarnings[p.id] = "Repository not found or is private. Check the URL or sign out and back in to refresh permissions.";
          } else if (result.repoStatus === "no_access") {
            repoWarnings[p.id] = "Access denied to this repository. Sign out and back in to refresh GitHub permissions.";
          } else if (result.repoStatus === "no_token") {
            repoWarnings[p.id] = "GitHub not connected. Sign out and back in to link your GitHub account.";
          } else if (result.repoStatus === "invalid_url") {
            repoWarnings[p.id] = "Invalid GitHub URL. Edit the project to fix it.";
          }

          return result.commits.map((c) => ({
            sha: c.sha,
            message: c.message,
            date: c.date,
            repo: p.name,
          }));
        } catch {
          return [];
        }
      });

      const allCommits = (await Promise.all(commitPromises)).flat()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      // Sidebar: 5 most recent commits across all linked repos
      recentCommits = allCommits.slice(0, 5);

      // Stat: total commits from the last 7 days (from the 30 fetched per repo)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weeklyCommitCount = allCommits.filter(
        (c) => c.date && new Date(c.date) >= weekAgo
      ).length;
    }
  } catch {
    // GitHub data is optional — silently degrade
  }

  // Internal activity for heatmap
  const finalActivity = await getActivityData(userId);

  // Compute stats
  const activeProjects = projects.filter((p) => p.status === "ACTIVE" || p.status === "DEPLOYED");
  const deployedProjects = projects.filter((p) => p.deployUrl || p.status === "DEPLOYED");
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
    hasTimeLog: await db.timeLog.count({ where: { project: { userId } } }).then((c) => c > 0),
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
      projects={projects.slice(0, 6).map((p) => {
        // Compute 7-day activity sparkline per project
        const now = new Date();
        const weekActivity: number[] = Array(7).fill(0);
        for (const t of p.tasks) {
          if (t.status === "DONE") {
            const daysAgo = Math.floor((now.getTime() - new Date(t.updatedAt).getTime()) / 86400000);
            if (daysAgo >= 0 && daysAgo < 7) weekActivity[6 - daysAgo]++;
          }
        }
        for (const l of p.timeLogs) {
          const daysAgo = Math.floor((now.getTime() - new Date(l.date).getTime()) / 86400000);
          if (daysAgo >= 0 && daysAgo < 7) weekActivity[6 - daysAgo]++;
        }
        for (const n of p.notes) {
          const daysAgo = Math.floor((now.getTime() - new Date(n.createdAt).getTime()) / 86400000);
          if (daysAgo >= 0 && daysAgo < 7) weekActivity[6 - daysAgo]++;
        }

        return {
          id: p.id,
          name: p.name,
          status: p.status,
          stack: p.stack,
          deployUrl: p.deployUrl,
          repoUrl: p.repoUrl,
          updatedAt: p.updatedAt,
          milestonesDone: p.milestones.filter((m) => m.completed).length,
          milestonesTotal: p.milestones.length,
          tasksDone: p.tasks.filter((t) => t.status === "DONE").length,
          tasksTotal: p.tasks.length,
          totalMinutes: p.timeLogs.reduce((sum, t) => sum + t.duration, 0),
          weekActivity,
          repoWarning: repoWarnings[p.id] ?? null,
        };
      })}
      recentCommits={recentCommits}
      recentNotes={notes.map((n) => ({
        id: n.id,
        title: n.title,
        type: n.type,
        projectName: n.project.name,
        updatedAt: n.updatedAt,
      }))}
      activityData={finalActivity}
    />
  );
}
