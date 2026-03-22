"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import {
  FolderKanban,
  Brain,
  Activity,
  Share2,
  Clock,
  UserCircle,
  Settings,
  ExternalLink,
  GitBranch,
  GitCommit,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Zap,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activityRef = useRef<HTMLDivElement>(null);
  const [activeCommit, setActiveCommit] = useState(0);

  // Animate commit feed
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCommit((prev) => (prev + 1) % commits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Stagger animate stat cards
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-card",
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 1.2, ease: "power2.out" }
      );
      gsap.fromTo(
        ".project-row",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.08, delay: 1.6, ease: "power2.out" }
      );
      gsap.fromTo(
        ".kanban-col",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.12, delay: 1.8, ease: "power2.out" }
      );
      gsap.fromTo(
        ".activity-item",
        { x: 8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 2.0, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex h-[520px] select-none overflow-hidden">
      {/* ─── Sidebar ─── */}
      <div className="flex w-[180px] shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex h-[36px] items-center border-b border-border px-3">
          <span className="font-mono text-[12px] font-medium text-text-primary">
            TRACK<span className="text-accent">FLOW</span>
          </span>
        </div>
        <nav className="flex-1 overflow-hidden p-2">
          {sidebarNavSections.map((section, sIdx) => (
            <div key={section.label} className={sIdx > 0 ? "mt-3" : ""}>
              <span className="px-2 text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                {section.label}
              </span>
              <ul className="mt-1.5 flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <div
                      className={`flex h-[28px] items-center gap-2 rounded-md px-2 text-[11px] ${
                        item.active
                          ? "bg-accent-light text-accent"
                          : "text-text-secondary"
                      }`}
                    >
                      <item.icon size={12} strokeWidth={item.active ? 1.75 : 1.5} />
                      {item.label}
                      {item.count && (
                        <span className="ml-auto font-mono text-[9px] text-text-tertiary">{item.count}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Recent projects */}
          <div className="mt-3">
            <span className="px-2 text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Recent
            </span>
            <ul className="mt-1.5 flex flex-col gap-0.5">
              {recentProjects.map((p) => (
                <li key={p.name} className="flex h-[26px] items-center gap-2 rounded-md px-2 text-[10px] text-text-secondary">
                  <span className={`size-[6px] rounded-full ${p.color}`} />
                  <span className="truncate">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Profile */}
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-2 p-1">
            <div className="flex size-[22px] items-center justify-center rounded-full bg-accent-light text-[8px] font-medium text-accent">
              SR
            </div>
            <div>
              <p className="text-[10px] font-medium leading-none text-text-primary">Shohjahon</p>
              <p className="text-[8px] text-text-tertiary">@soqqali</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-[36px] items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-text-primary">Projects</span>
            <span className="rounded-full bg-accent-light px-1.5 py-0.5 font-mono text-[9px] text-accent">7 active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-[22px] items-center gap-1 rounded-md border-[0.5px] border-border px-2 text-[9px] text-text-tertiary">
              <BarChart3 size={9} />
              Grid
            </div>
            <div className="flex h-[22px] items-center gap-1 rounded-md bg-accent px-2 text-[9px] font-medium text-cloud">
              + New
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: projects + stats */}
          <div className="flex-1 overflow-hidden p-4">
            {/* Stats row */}
            <div className="flex gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card flex flex-1 flex-col gap-1 rounded-md border-[0.5px] border-border bg-surface p-2.5 opacity-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-text-tertiary">{stat.label}</span>
                    <stat.icon size={10} className="text-text-tertiary" />
                  </div>
                  <span className="font-mono text-[18px] font-medium leading-none text-text-primary">
                    {stat.value}
                  </span>
                  <span className={`text-[8px] ${stat.trend.startsWith("+") ? "text-success" : "text-text-tertiary"}`}>
                    {stat.trend}
                  </span>
                </div>
              ))}
            </div>

            {/* Project table */}
            <div className="mt-3 overflow-hidden rounded-md border-[0.5px] border-border">
              <div className="flex h-[26px] items-center border-b border-border bg-surface px-3 text-[8px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                <span className="w-[28%]">Project</span>
                <span className="w-[14%] text-center">Status</span>
                <span className="w-[22%]">Stack</span>
                <span className="w-[14%] text-center">Commits</span>
                <span className="w-[10%] text-center">Deploy</span>
                <span className="w-[12%] text-right">Activity</span>
              </div>
              {projects.map((p, i) => (
                <div
                  key={p.name}
                  className={`project-row flex h-[32px] items-center border-b-[0.5px] border-border px-3 opacity-0 last:border-0 ${
                    i === 0 ? "bg-accent-light/30" : "hover:bg-fog dark:hover:bg-surface-hover"
                  }`}
                >
                  <div className="flex w-[28%] items-center gap-1.5">
                    <span className={`size-[6px] rounded-full ${p.dotColor}`} />
                    <span className="text-[11px] font-medium text-text-primary">{p.name}</span>
                  </div>
                  <span className="flex w-[14%] justify-center">
                    <Badge variant={p.statusVariant} className="text-[7px] px-1 h-4">{p.status}</Badge>
                  </span>
                  <div className="flex w-[22%] gap-0.5">
                    {p.stack.map((t) => (
                      <span key={t} className="rounded-sm bg-indigo-50 px-1 py-0.5 font-mono text-[7px] text-indigo-600">{t}</span>
                    ))}
                  </div>
                  <span className="w-[14%] text-center font-mono text-[10px] text-text-secondary">{p.commits}</span>
                  <span className="flex w-[10%] justify-center">
                    {p.deployed ? (
                      <CheckCircle2 size={11} className="text-success" strokeWidth={2} />
                    ) : (
                      <Circle size={11} className="text-ash" strokeWidth={1} />
                    )}
                  </span>
                  <div className="flex w-[12%] justify-end gap-[1px]">
                    {p.activity.map((v, j) => (
                      <div
                        key={j}
                        className="w-[3px] rounded-sm bg-accent"
                        style={{ height: `${v}px`, opacity: 0.3 + v / 16 }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mini kanban */}
            <div className="mt-3 flex gap-2">
              {kanbanCols.map((col) => (
                <div key={col.title} className="kanban-col flex-1 rounded-md border-[0.5px] border-border bg-surface p-2 opacity-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-text-secondary">{col.title}</span>
                    <span className="font-mono text-[8px] text-text-tertiary">{col.items.length}</span>
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {col.items.map((item) => (
                      <div key={item} className="rounded border-[0.5px] border-border bg-background px-2 py-1 text-[9px] text-text-body">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: activity feed */}
          <div ref={activityRef} className="hidden w-[200px] shrink-0 border-l border-border p-3 lg:block">
            <span className="text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Live activity
            </span>

            <div className="mt-2 space-y-2">
              {commits.map((c, i) => (
                <div
                  key={c.hash}
                  className={`activity-item flex gap-2 rounded-md p-1.5 opacity-0 transition-colors duration-300 ${
                    i === activeCommit ? "bg-accent-light/50" : ""
                  }`}
                >
                  <GitCommit
                    size={11}
                    className={`mt-0.5 shrink-0 ${i === activeCommit ? "text-accent" : "text-ash"}`}
                    strokeWidth={i === activeCommit ? 2 : 1.5}
                  />
                  <div>
                    <p className="text-[9px] font-medium text-text-primary leading-tight">{c.message}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-mono text-[8px] text-text-tertiary">{c.hash}</span>
                      <span className="text-[8px] text-text-tertiary">{c.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Deploy status */}
            <div className="mt-4">
              <span className="text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Deploys
              </span>
              <div className="mt-2 space-y-1.5">
                {deploys.map((d) => (
                  <div key={d.project} className="flex items-center gap-2">
                    <span className={`size-[6px] rounded-full ${d.ok ? "bg-success" : "bg-danger"}`} />
                    <span className="flex-1 truncate text-[9px] text-text-secondary">{d.project}</span>
                    <span className="font-mono text-[8px] text-text-tertiary">{d.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Time logged */}
            <div className="mt-4">
              <span className="text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                This week
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-[20px] font-medium leading-none text-text-primary">24.5</span>
                <span className="text-[9px] text-text-tertiary">hrs logged</span>
              </div>
              <div className="mt-1.5 flex gap-[2px]">
                {weekHours.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-sm bg-accent"
                      style={{ height: `${h * 3}px`, opacity: 0.4 + h / 12 }}
                    />
                    <span className="text-[7px] text-text-tertiary">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Data ─── */

const sidebarNavSections = [
  {
    label: "Workspace",
    items: [
      { label: "Projects", icon: FolderKanban, active: true, count: "7" },
      { label: "Brain", icon: Brain, active: false, count: "12" },
      { label: "Activity", icon: Activity, active: false, count: null },
      { label: "Shares", icon: Share2, active: false, count: "3" },
      { label: "Time log", icon: Clock, active: false, count: null },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", icon: UserCircle, active: false, count: null },
      { label: "Settings", icon: Settings, active: false, count: null },
    ],
  },
];

const recentProjects = [
  { name: "TrackFlow", color: "bg-accent" },
  { name: "Client portal", color: "bg-success" },
  { name: "AI experiment", color: "bg-warning" },
];

const stats = [
  { label: "Active projects", value: "7", trend: "+2 this month", icon: FolderKanban },
  { label: "Commits (7d)", value: "47", trend: "+12 vs last week", icon: GitCommit },
  { label: "Hours logged", value: "24.5", trend: "+3.2 vs last week", icon: Clock },
  { label: "Ship streak", value: "23d", trend: "Personal best", icon: Zap },
];

const projects = [
  { name: "TrackFlow", status: "active", statusVariant: "info" as const, stack: ["Next.js", "TS"], commits: "142", deployed: true, dotColor: "bg-accent", activity: [4, 8, 6, 12, 10, 14, 8] },
  { name: "Client portal", status: "deployed", statusVariant: "success" as const, stack: ["React", "Node"], commits: "89", deployed: true, dotColor: "bg-success", activity: [6, 4, 8, 6, 2, 4, 10] },
  { name: "AI experiment", status: "stale", statusVariant: "warning" as const, stack: ["Python", "FastAPI"], commits: "34", deployed: false, dotColor: "bg-warning", activity: [8, 6, 2, 0, 0, 0, 0] },
  { name: "SaaS starter", status: "active", statusVariant: "info" as const, stack: ["Next.js", "Stripe"], commits: "67", deployed: false, dotColor: "bg-info", activity: [2, 6, 8, 4, 6, 10, 6] },
  { name: "Portfolio v3", status: "active", statusVariant: "info" as const, stack: ["Astro"], commits: "23", deployed: true, dotColor: "bg-accent", activity: [2, 4, 6, 8, 4, 2, 6] },
];

const kanbanCols = [
  { title: "To do", items: ["Auth flow", "OG images"] },
  { title: "In progress", items: ["Dashboard UI", "Brain editor"] },
  { title: "Done", items: ["Prisma schema", "GitHub OAuth", "Landing page"] },
];

const commits = [
  { hash: "a3f2c1", message: "feat: add project dashboard kanban", time: "2m ago" },
  { hash: "b7d4e2", message: "fix: resolve OAuth callback redirect", time: "14m ago" },
  { hash: "c9a1f3", message: "style: update sidebar active states", time: "32m ago" },
  { hash: "d2b5a4", message: "feat: prompt library copy to clipboard", time: "1h ago" },
  { hash: "e8c3d6", message: "refactor: extract card component", time: "2h ago" },
];

const deploys = [
  { project: "TrackFlow", ok: true, time: "3m" },
  { project: "Client portal", ok: true, time: "2h" },
  { project: "Portfolio v3", ok: false, time: "5h" },
];

const weekHours = [4, 6, 5, 3.5, 4, 1.5, 0.5];
