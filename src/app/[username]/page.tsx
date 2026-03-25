import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getUserOctokit, getContributionData } from "@/lib/github";
import { getActivityData } from "@/actions/activity";
import { PublicProfile } from "@/components/profile/public-profile";
import { ProfileTracker } from "@/components/profile/profile-tracker";

export const revalidate = 300; // ISR: 5 minutes

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await db.user.findUnique({
    where: { username },
    select: { name: true, bio: true, username: true },
  });

  if (!user) return { title: "Not found" };

  return {
    title: `${user.name ?? user.username} — TrackFlow`,
    description: user.bio ?? `${user.name ?? user.username}'s developer profile on TrackFlow.`,
    openGraph: {
      title: `${user.name ?? user.username}`,
      description: user.bio ?? "Developer profile on TrackFlow",
      images: [`/api/og?username=${user.username}`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name ?? user.username}`,
      description: user.bio ?? "Developer profile on TrackFlow",
      images: [`/api/og?username=${user.username}`],
    },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      image: true,
      githubUsername: true,
      createdAt: true,
      projects: {
        where: { status: { in: ["ACTIVE", "DEPLOYED"] }, showOnProfile: true },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          status: true,
          stack: true,
          deployUrl: true,
          repoUrl: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Calculate streak (consecutive days with project updates)
  const updates = user.projects
    .map((p) => p.updatedAt.toISOString().split("T")[0])
    .sort()
    .reverse();

  const uniqueDays = [...new Set(updates)];
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < uniqueDays.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().split("T")[0];

    if (uniqueDays[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  // Collect all unique techs
  const allTechs = [...new Set(user.projects.flatMap((p) => p.stack))];

  // Fetch internal activity + GitHub activity and merge
  const [internalActivity, githubActivity] = await Promise.all([
    getActivityData(user.id),
    (async () => {
      if (!user.githubUsername) return [];
      try {
        const octokit = await getUserOctokit(user.id);
        if (octokit) return await getContributionData(octokit, user.githubUsername);
      } catch {
        // GitHub data is optional
      }
      return [];
    })(),
  ]);

  // Merge activity by date (additive)
  const merged = new Map<string, number>();
  for (const a of internalActivity) {
    merged.set(a.date, (merged.get(a.date) ?? 0) + a.count);
  }
  for (const a of githubActivity) {
    merged.set(a.date, (merged.get(a.date) ?? 0) + a.count);
  }
  const activity = Array.from(merged.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-background">
      <ProfileTracker userId={user.id} />
      <PublicProfile
        user={{
          name: user.name,
          username: user.username!,
          bio: user.bio,
          image: user.image,
          githubUsername: user.githubUsername,
          createdAt: user.createdAt,
        }}
        projects={user.projects}
        streak={streak}
        techs={allTechs}
        activity={activity}
      />
    </div>
  );
}
