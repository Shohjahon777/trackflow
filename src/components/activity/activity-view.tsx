"use client";

import { useState } from "react";
import { GitBranch, Star, Lock, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { GitHubRepo } from "@/lib/github";

type ActivityViewProps = {
  repos: GitHubRepo[];
  activity: { date: string; count: number }[];
};

export function ActivityView({ repos, activity }: ActivityViewProps) {
  const [search, setSearch] = useState("");

  const filteredRepos = repos.filter((r) =>
    search ? r.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="space-y-8">
      {/* Activity heatmap */}
      <section>
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Recent activity
        </h2>
        <div className="mt-3">
          <ActivityHeatmap data={activity} />
        </div>
      </section>

      {/* Repos */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Repositories
          </h2>
          <span className="font-mono text-[11px] text-text-tertiary">
            {repos.length} repos
          </span>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border-[0.5px] border-border">
          <div className="flex h-[36px] items-center border-b-[0.5px] border-border px-4 text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <span className="flex-1">Repository</span>
            <span className="w-24 text-center">Language</span>
            <span className="w-16 text-center">Stars</span>
            <span className="w-16 text-center">Visibility</span>
            <span className="w-28 text-right font-mono">Last push</span>
          </div>

          {filteredRepos.length === 0 ? (
            <div className="px-4 py-8 text-center text-[14px] text-text-secondary">
              {repos.length === 0
                ? "No repositories found. Connect your GitHub account to see your repos."
                : "No repos match your search."}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[40px] items-center border-b-[0.5px] border-border px-4 transition-colors duration-[120ms] last:border-b-0 hover:bg-fog dark:hover:bg-surface-hover"
              >
                <div className="flex flex-1 items-center gap-2 min-w-0">
                  <GitBranch size={14} className="shrink-0 text-text-tertiary" strokeWidth={1.5} />
                  <span className="truncate text-[14px] font-medium text-text-primary">
                    {repo.name}
                  </span>
                  {repo.description && (
                    <span className="hidden truncate text-[12px] text-text-tertiary lg:inline">
                      — {repo.description}
                    </span>
                  )}
                </div>
                <span className="flex w-24 justify-center">
                  {repo.language ? (
                    <Badge variant="tech">{repo.language}</Badge>
                  ) : (
                    <span className="text-[12px] text-text-tertiary">—</span>
                  )}
                </span>
                <span className="flex w-16 items-center justify-center gap-1 font-mono text-[12px] text-text-tertiary">
                  <Star size={11} strokeWidth={1.5} />
                  {repo.stargazers_count}
                </span>
                <span className="flex w-16 justify-center">
                  {repo.private ? (
                    <Lock size={13} className="text-text-tertiary" strokeWidth={1.5} />
                  ) : (
                    <Globe size={13} className="text-success" strokeWidth={1.5} />
                  )}
                </span>
                <span className="w-28 text-right font-mono text-[12px] text-text-tertiary">
                  {repo.pushed_at
                    ? new Date(repo.pushed_at).toLocaleDateString()
                    : "—"}
                </span>
              </a>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityHeatmap({ data }: { data: { date: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <p className="text-[14px] text-text-secondary">
        No recent activity data. Activity will appear here once you start pushing to GitHub.
      </p>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex flex-wrap gap-[3px]">
      {data.map((d) => {
        const ratio = d.count / maxCount;
        const intensity =
          ratio > 0.75
            ? "bg-accent"
            : ratio > 0.5
              ? "bg-indigo-300"
              : ratio > 0.25
                ? "bg-indigo-100"
                : "bg-fog dark:bg-surface-hover";

        return (
          <div
            key={d.date}
            title={`${d.date}: ${d.count} events`}
            className={`size-[10px] rounded-[2px] ${intensity}`}
          />
        );
      })}
    </div>
  );
}
