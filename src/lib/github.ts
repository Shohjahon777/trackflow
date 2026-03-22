import { Octokit } from "@octokit/rest";
import { db } from "@/lib/db";

export function createOctokit(accessToken: string) {
  return new Octokit({ auth: accessToken });
}

export async function getGitHubToken(userId: string): Promise<string | null> {
  const account = await db.account.findFirst({
    where: { userId, provider: "github" },
    select: { access_token: true },
  });
  return account?.access_token ?? null;
}

export async function getUserOctokit(userId: string): Promise<Octokit | null> {
  const token = await getGitHubToken(userId);
  if (!token) return null;
  return createOctokit(token);
}

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string | null;
  pushed_at: string | null;
  private: boolean;
};

export type GitHubCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
};

export async function getUserRepos(octokit: Octokit): Promise<GitHubRepo[]> {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "pushed",
    per_page: 50,
    type: "owner",
  });
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    html_url: r.html_url,
    description: r.description,
    language: r.language,
    stargazers_count: r.stargazers_count,
    updated_at: r.updated_at,
    pushed_at: r.pushed_at,
    private: r.private,
  }));
}

export async function getRepoCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  perPage = 10
): Promise<GitHubCommit[]> {
  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: perPage,
    });
    return data.map((c) => ({
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0],
      date: c.commit.author?.date ?? "",
      url: c.html_url,
    }));
  } catch {
    return [];
  }
}

export async function getContributionData(
  octokit: Octokit,
  username: string
): Promise<{ date: string; count: number }[]> {
  // GitHub REST API doesn't have a direct contribution graph endpoint.
  // Use the events API as an approximation.
  try {
    const { data } = await octokit.activity.listEventsForAuthenticatedUser({
      username,
      per_page: 100,
    });

    const counts = new Map<string, number>();
    for (const event of data) {
      if (!event.created_at) continue;
      const date = event.created_at.split("T")[0];
      counts.set(date, (counts.get(date) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}
