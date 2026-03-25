"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Check,
  Terminal,
  Globe,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Eye,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

gsap.registerPlugin(ScrollTrigger);

export function FeatureSections() {
  return (
    <div id="features" className="scroll-mt-[48px] space-y-0">
      <FeatureBlock
        index={0}
        label="Multi-project dashboard"
        headline="See everything at a glance"
        description="Grid, list, or kanban — your projects, their status, stack, deploy
          URLs, and last activity. No more 12 browser tabs."
        visual={<DashboardVisual />}
      />
      <FeatureBlock
        index={1}
        label="Project brain"
        headline="Never lose context again"
        description="Save architecture decisions, working prompts, and markdown notes per project.
          One-click copy to paste into Claude, Cursor, or Bolt."
        visual={<BrainVisual />}
        reversed
      />
      <FeatureBlock
        index={2}
        label="Focus timer"
        headline="Ship with pomodoro flow"
        description="Built-in pomodoro timer linked to tasks. Complete a session and your
          time log updates automatically. See how many deep work sessions each task took."
        visual={<PomodoroVisual />}
      />
      <FeatureBlock
        index={3}
        label="Client share links"
        headline="Show clients without the chaos"
        description="Generate a read-only URL per project. Clients see status and
          milestones in real-time. They never see your notes, costs, or other projects."
        visual={<ShareVisual />}
        reversed
      />
      <FeatureBlock
        index={4}
        label="Portfolio analytics"
        headline="Know who visits your profile"
        description="Track profile views, project clicks, top referrers, and visitor
          regions — all from a clean dashboard. See what's getting attention."
        visual={<AnalyticsVisual />}
      />
      <FeatureBlock
        index={5}
        label="Public profile"
        headline="Your shipping portfolio"
        description="trackflow.dev/username — activity heatmap, shipped projects, tech
          stack. A living portfolio that updates as you build."
        visual={<ProfileVisual />}
        reversed
      />
    </div>
  );
}

function FeatureBlock({
  index,
  label,
  headline,
  description,
  visual,
  reversed = false,
}: {
  index: number;
  label: string;
  headline: string;
  description: string;
  visual: React.ReactNode;
  reversed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text slides in from the side with staggered children
      const textChildren = textRef.current?.children;
      if (textChildren) {
        gsap.fromTo(
          Array.from(textChildren),
          { x: reversed ? 50 : -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 75%",
              once: true,
            },
          }
        );
      }

      // Visual scales up with a slight rotation
      gsap.fromTo(
        visualRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 72%",
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [reversed]);

  return (
    <section
      ref={ref}
      className={`border-t border-border px-6 py-24 md:px-12 ${
        index % 2 === 1 ? "bg-surface" : "bg-background"
      }`}
    >
      <div
        className={`mx-auto flex max-w-[1120px] flex-col items-center gap-12 lg:flex-row lg:gap-16 ${
          reversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Text */}
        <div ref={textRef} className="flex-1 space-y-4 lg:max-w-[400px]">
          <span className="block text-[11px] font-medium uppercase tracking-[0.04em] text-accent opacity-0">
            {label}
          </span>
          <h2 className="text-[28px] font-medium leading-[1.15] text-text-primary opacity-0 md:text-[32px]">
            {headline}
          </h2>
          <p className="text-[15px] leading-[1.7] text-text-secondary opacity-0">{description}</p>
        </div>

        {/* Visual */}
        <div
          ref={visualRef}
          className="w-full flex-1 overflow-hidden rounded-lg border-[0.5px] border-border opacity-0 shadow-lg shadow-ink/5"
        >
          {visual}
        </div>
      </div>
    </section>
  );
}

/* ─── Visuals ─── */

function DashboardVisual() {
  const projects = [
    { name: "TrackFlow", status: "active", variant: "info" as const, stack: ["Next.js", "TS", "Prisma"], date: "Today" },
    { name: "Client portal", status: "deployed", variant: "success" as const, stack: ["React", "Node"], date: "2d ago" },
    { name: "AI experiment", status: "stale", variant: "warning" as const, stack: ["Python", "FastAPI"], date: "7d ago" },
    { name: "Portfolio v2", status: "archived", variant: "neutral" as const, stack: ["Astro"], date: "30d ago" },
    { name: "SaaS starter", status: "paused", variant: "neutral" as const, stack: ["Next.js", "Stripe"], date: "14d ago" },
  ];

  return (
    <div className="bg-background p-5">
      {/* Table header */}
      <div className="flex h-[32px] items-center border-b-[0.5px] border-border px-3 text-[10px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
        <span className="flex-1">Name</span>
        <span className="w-20 text-center">Status</span>
        <span className="w-32">Stack</span>
        <span className="w-16 text-right">Updated</span>
      </div>
      {projects.map((p) => (
        <div
          key={p.name}
          className="flex h-[36px] items-center border-b-[0.5px] border-border px-3 last:border-0 hover:bg-fog dark:hover:bg-surface-hover"
        >
          <span className="flex-1 text-[13px] font-medium text-text-primary">{p.name}</span>
          <span className="flex w-20 justify-center">
            <Badge variant={p.variant} className="text-[9px]">{p.status}</Badge>
          </span>
          <span className="flex w-32 gap-1">
            {p.stack.map((t) => (
              <span key={t} className="rounded-sm bg-indigo-50 px-1 py-0.5 font-mono text-[8px] font-medium text-indigo-600">
                {t}
              </span>
            ))}
          </span>
          <span className="w-16 text-right font-mono text-[10px] text-text-tertiary">{p.date}</span>
        </div>
      ))}
    </div>
  );
}

function BrainVisual() {
  return (
    <div className="bg-background p-5 space-y-3">
      {/* Prompt card */}
      <div className="rounded-md border-[0.5px] border-border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-[24px] items-center justify-center rounded-md bg-accent-light">
              <Terminal size={12} className="text-accent" />
            </div>
            <span className="text-[12px] font-medium text-text-primary">Project context for Claude</span>
          </div>
          <div className="flex size-[24px] items-center justify-center rounded-md text-success bg-success-bg">
            <Check size={12} />
          </div>
        </div>
        <div className="rounded-md bg-surface px-2.5 py-2">
          <pre className="whitespace-pre-wrap font-mono text-[10px] leading-[1.6] text-text-body">
{`You are working on {{project_name}}.
Framework: Next.js 16 (App Router)
Database: PostgreSQL on Neon via Prisma
Auth: NextAuth v5 with GitHub OAuth

Key rules:
- Server Components by default
- Server Actions for mutations`}
          </pre>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] text-text-tertiary">Variables:</span>
          <span className="rounded-sm bg-warning-bg px-1 py-0.5 font-mono text-[8px] text-warning">
            {"{{project_name}}"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <span className="rounded-sm bg-indigo-50 px-1 py-0.5 font-mono text-[8px] font-medium text-indigo-600">context</span>
            <span className="rounded-sm bg-indigo-50 px-1 py-0.5 font-mono text-[8px] font-medium text-indigo-600">claude</span>
          </div>
          <span className="font-mono text-[9px] text-text-tertiary">23x copied</span>
        </div>
      </div>

      {/* ADR card */}
      <div className="rounded-md border-[0.5px] border-border p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-text-primary">Use Server Actions over API routes</span>
          <Badge variant="success" className="text-[8px]">accepted</Badge>
        </div>
        <div>
          <span className="text-[9px] font-medium uppercase tracking-[0.04em] text-text-tertiary">Decision</span>
          <p className="text-[10px] leading-[1.5] text-text-secondary">
            Server Actions for all mutations. API routes only for webhooks and public endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}

function PomodoroVisual() {
  return (
    <div className="bg-background p-5 space-y-4">
      {/* Task header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-[24px] items-center justify-center rounded-md bg-accent-light">
            <Timer size={12} className="text-accent" />
          </div>
          <div>
            <p className="text-[12px] font-medium text-text-primary">Implement auth flow</p>
            <p className="text-[9px] text-text-tertiary">TrackFlow &middot; In progress</p>
          </div>
        </div>
        <Badge variant="info" className="text-[8px]">focused</Badge>
      </div>

      {/* Timer display */}
      <div className="flex flex-col items-center py-4">
        <div className="relative flex size-[120px] items-center justify-center">
          {/* Circular progress ring */}
          <svg className="absolute inset-0" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
            <circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * 0.35}`}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <span className="font-mono text-[28px] font-medium text-text-primary">19:32</span>
        </div>
        <p className="mt-2 text-[10px] text-text-tertiary">30 min session &middot; 65% complete</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button className="flex size-[32px] items-center justify-center rounded-md border-[0.5px] border-border text-text-tertiary">
          <RotateCcw size={14} strokeWidth={1.5} />
        </button>
        <button className="flex size-[40px] items-center justify-center rounded-full bg-accent text-cloud">
          <Pause size={16} strokeWidth={2} />
        </button>
        <button className="flex size-[32px] items-center justify-center rounded-md border-[0.5px] border-border text-text-tertiary">
          <Play size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Session stats */}
      <div className="flex items-center justify-between rounded-md border-[0.5px] border-border bg-surface px-3 py-2">
        <div className="text-center">
          <p className="font-mono text-[16px] font-medium text-text-primary">4</p>
          <p className="text-[8px] text-text-tertiary">sessions today</p>
        </div>
        <div className="h-[24px] w-[0.5px] bg-border" />
        <div className="text-center">
          <p className="font-mono text-[16px] font-medium text-text-primary">2h</p>
          <p className="text-[8px] text-text-tertiary">deep work</p>
        </div>
        <div className="h-[24px] w-[0.5px] bg-border" />
        <div className="text-center">
          <p className="font-mono text-[16px] font-medium text-accent">12</p>
          <p className="text-[8px] text-text-tertiary">total pomodoros</p>
        </div>
      </div>
    </div>
  );
}

function ShareVisual() {
  return (
    <div className="bg-background">
      {/* Browser bar */}
      <div className="flex h-[32px] items-center gap-2 border-b border-border bg-surface px-3">
        <div className="flex gap-1">
          <span className="size-[8px] rounded-full bg-danger/60" />
          <span className="size-[8px] rounded-full bg-warning/60" />
          <span className="size-[8px] rounded-full bg-success/60" />
        </div>
        <div className="flex h-[18px] flex-1 items-center justify-center rounded bg-fog px-2 text-[9px] text-text-tertiary dark:bg-surface-hover">
          <Globe size={8} className="mr-1" />
          trackflow.dev/share/a8f3k2x
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-text-primary">Client portal</p>
            <p className="text-[11px] text-text-secondary">Dashboard for freelance clients</p>
          </div>
          <Badge variant="success">deployed</Badge>
        </div>
        {/* Milestones */}
        <div className="space-y-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-tertiary">Milestones</span>
          <div className="space-y-1.5">
            {["Auth + user dashboard", "Invoice generation", "Payment integration"].map((m, i) => (
              <div key={m} className="flex items-center gap-2">
                <div className={`size-[14px] rounded-full border-[1.5px] ${i < 2 ? "border-success bg-success-bg" : "border-border"} flex items-center justify-center`}>
                  {i < 2 && <Check size={8} className="text-success" />}
                </div>
                <span className={`text-[12px] ${i < 2 ? "text-text-secondary line-through" : "text-text-primary"}`}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Live status */}
        <div className="flex items-center gap-2 rounded-md bg-success-bg px-3 py-2">
          <span className="size-[6px] rounded-full bg-success" />
          <span className="text-[11px] text-success">Client can see this in real-time — no login needed</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  const viewBars = [3, 7, 5, 12, 8, 15, 10, 18, 6, 14, 9, 20, 11, 16];
  const maxView = Math.max(...viewBars);

  return (
    <div className="bg-background p-5 space-y-4">
      {/* Stat cards row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-md border-[0.5px] border-border bg-surface p-2.5">
          <div className="flex items-center gap-1.5">
            <Eye size={10} className="text-text-tertiary" strokeWidth={1.5} />
            <span className="text-[9px] text-text-tertiary">Profile views</span>
          </div>
          <p className="mt-1 font-mono text-[18px] font-medium text-text-primary">284</p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-2.5">
          <div className="flex items-center gap-1.5">
            <MousePointerClick size={10} className="text-text-tertiary" strokeWidth={1.5} />
            <span className="text-[9px] text-text-tertiary">Project clicks</span>
          </div>
          <p className="mt-1 font-mono text-[18px] font-medium text-text-primary">67</p>
        </div>
        <div className="rounded-md border-[0.5px] border-border bg-surface p-2.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={10} className="text-text-tertiary" strokeWidth={1.5} />
            <span className="text-[9px] text-text-tertiary">Top referrer</span>
          </div>
          <p className="mt-1 truncate text-[12px] font-medium text-text-primary">twitter.com</p>
        </div>
      </div>

      {/* Mini chart */}
      <div className="rounded-md border-[0.5px] border-border bg-surface p-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-text-primary">Daily profile views</span>
          <span className="text-[9px] text-text-tertiary">Last 14 days</span>
        </div>
        <div className="mt-3 flex items-end gap-1" style={{ height: 60 }}>
          {viewBars.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-accent/60"
              style={{ height: `${Math.max((v / maxView) * 100, 8)}%` }}
            />
          ))}
        </div>
      </div>

      {/* Visitor regions */}
      <div className="rounded-md border-[0.5px] border-border bg-surface p-3">
        <div className="flex items-center gap-1.5">
          <Globe size={10} className="text-text-tertiary" strokeWidth={1.5} />
          <span className="text-[10px] font-medium text-text-primary">Visitor regions</span>
        </div>
        <div className="mt-2 space-y-1.5">
          {[
            { country: "United States", count: 89 },
            { country: "Germany", count: 34 },
            { country: "Uzbekistan", count: 28 },
            { country: "United Kingdom", count: 19 },
          ].map((c) => (
            <div key={c.country} className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary">{c.country}</span>
              <span className="font-mono text-[9px] text-text-tertiary">{c.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileVisual() {
  const weeks = 20;
  const days = 7;

  return (
    <div className="bg-background p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-[40px] items-center justify-center rounded-full bg-accent-light text-[14px] font-medium text-accent">
          SR
        </div>
        <div>
          <p className="text-[14px] font-medium text-text-primary">Shohjahon Razzoqov</p>
          <p className="font-mono text-[11px] text-text-tertiary">@soqqali</p>
        </div>
      </div>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1">
        {["Next.js", "TypeScript", "Python", "React", "Prisma", "Tailwind"].map((t) => (
          <span key={t} className="rounded-sm bg-indigo-50 px-1.5 py-0.5 font-mono text-[9px] font-medium text-indigo-600">
            {t}
          </span>
        ))}
      </div>

      {/* Heatmap */}
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-tertiary">Activity</span>
        <div className="mt-2 flex gap-[3px]">
          {Array.from({ length: weeks }).map((_, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {Array.from({ length: days }).map((_, d) => {
                const seed = (w * 7 + d * 13 + 37) % 10;
                const intensity =
                  seed > 6 ? "bg-indigo-500" : seed > 3 ? "bg-indigo-100" : seed > 1 ? "bg-indigo-50" : "bg-fog dark:bg-surface-hover";
                return (
                  <div
                    key={d}
                    className={`size-[8px] rounded-[2px] ${intensity}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-[28px] font-medium leading-none text-text-primary">47</span>
        <span className="text-[11px] text-text-secondary">day shipping streak</span>
      </div>
    </div>
  );
}
