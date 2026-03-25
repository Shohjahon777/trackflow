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

/**
 * Check if the stored OAuth token has the `repo` scope (private repo access).
 * Returns false if the token only has public access (stale token from before scope was added).
 */
export async function hasRepoScope(octokit: Octokit): Promise<boolean> {
  try {
    const { headers } = await octokit.repos.listForAuthenticatedUser({
      per_page: 1,
    });
    // GitHub returns x-oauth-scopes header with the granted scopes
    const scopes = headers["x-oauth-scopes"] ?? "";
    return scopes.includes("repo");
  } catch {
    return false;
  }
}

export async function getUserRepos(octokit: Octokit): Promise<GitHubRepo[]> {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    sort: "pushed",
    per_page: 50,
    type: "all",
    visibility: "all",
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

export type RepoStatus = "ok" | "not_found" | "no_access" | "no_token" | "invalid_url" | "error";

export type CommitsResult = {
  commits: GitHubCommit[];
  repoStatus: RepoStatus;
};

/**
 * Silent repo check using raw fetch — avoids Octokit throwing
 * errors that Next.js dev server logs even when caught.
 * Returns HTTP status code or 0 on network failure.
 */
async function checkRepo(token: string, owner: string, repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    return res.status;
  } catch {
    return 0;
  }
}

export async function getRepoCommits(
  octokit: Octokit,
  owner: string,
  repo: string,
  perPage = 10,
  token?: string
): Promise<CommitsResult> {
  // Pre-check with raw fetch if token is available
  if (token) {
    const status = await checkRepo(token, owner, repo);
    if (status === 404) return { commits: [], repoStatus: "not_found" };
    if (status === 403) return { commits: [], repoStatus: "no_access" };
    if (status !== 200) return { commits: [], repoStatus: "error" };
  }

  try {
    const { data } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: perPage,
    });
    return {
      commits: data.map((c) => ({
        sha: c.sha.slice(0, 7),
        message: c.commit.message.split("\n")[0],
        date: c.commit.author?.date ?? "",
        url: c.html_url,
      })),
      repoStatus: "ok",
    };
  } catch {
    return { commits: [], repoStatus: "error" };
  }
}

/**
 * Parse a GitHub repo URL into owner/repo.
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/.]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

export type RepoValidationResult =
  | { valid: true; fullName: string; isPrivate: boolean }
  | { valid: false; reason: string; hint: string };

/**
 * Validate that a GitHub repo URL is accessible with the user's token.
 * Returns a user-friendly error with fix instructions if not.
 */
export async function validateRepoAccess(
  userId: string,
  repoUrl: string
): Promise<RepoValidationResult> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) {
    return {
      valid: false,
      reason: "Invalid GitHub URL",
      hint: "Use the format: https://github.com/owner/repo",
    };
  }

  const octokit = await getUserOctokit(userId);
  if (!octokit) {
    return {
      valid: false,
      reason: "GitHub not connected",
      hint: "Sign out and sign back in to connect your GitHub account.",
    };
  }

  try {
    const { data } = await octokit.repos.get({
      owner: parsed.owner,
      repo: parsed.repo,
    });
    return { valid: true, fullName: data.full_name, isPrivate: data.private };
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 404) {
      return {
        valid: false,
        reason: "Repository not found",
        hint: `"${parsed.owner}/${parsed.repo}" doesn't exist or is private. If it's private, try signing out and back in to refresh your GitHub permissions.`,
      };
    }
    if (status === 403) {
      return {
        valid: false,
        reason: "Access denied",
        hint: "Your GitHub token doesn't have permission. Sign out and back in to grant access.",
      };
    }
    return {
      valid: false,
      reason: "Could not reach GitHub",
      hint: "GitHub may be temporarily unavailable. Try again in a moment.",
    };
  }
}

/**
 * Fetch recent commits for a specific project's repo.
 */
export async function getProjectCommits(
  userId: string,
  repoUrl: string,
  limit = 10
): Promise<CommitsResult> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) return { commits: [], repoStatus: "invalid_url" };

  const token = await getGitHubToken(userId);
  if (!token) return { commits: [], repoStatus: "no_token" };

  const octokit = createOctokit(token);
  return getRepoCommits(octokit, parsed.owner, parsed.repo, limit, token);
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
