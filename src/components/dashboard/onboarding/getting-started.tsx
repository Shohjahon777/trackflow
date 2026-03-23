"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  UserCircle,
  FolderKanban,
  Brain,
  Share2,
  Clock,
  Globe,
  X,
  Sparkles,
} from "lucide-react";

type OnboardingStep = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: typeof FolderKanban;
  completed: boolean;
};

type GettingStartedProps = {
  steps: {
    hasUsername: boolean;
    hasProject: boolean;
    hasNote: boolean;
    hasShare: boolean;
    hasTimeLog: boolean;
    hasPublicProfile: boolean;
  };
  username: string | null;
};

export function GettingStarted({ steps, username }: GettingStartedProps) {
  const [dismissed, setDismissed] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "profile",
      label: "Set up your profile",
      description: "Add a username and bio",
      href: "/settings",
      icon: UserCircle,
      completed: steps.hasUsername,
    },
    {
      id: "project",
      label: "Create a project",
      description: "Start tracking your work",
      href: "/projects",
      icon: FolderKanban,
      completed: steps.hasProject,
    },
    {
      id: "note",
      label: "Add a brain note",
      description: "Save a decision or prompt",
      href: "/brain",
      icon: Brain,
      completed: steps.hasNote,
    },
    {
      id: "share",
      label: "Share with a client",
      description: "Generate a share link",
      href: "/shares",
      icon: Share2,
      completed: steps.hasShare,
    },
    {
      id: "time",
      label: "Log your first hours",
      description: "Track time on a project",
      href: "/time-log",
      icon: Clock,
      completed: steps.hasTimeLog,
    },
    {
      id: "public",
      label: "Visit your public profile",
      description: username ? `trackflow.dev/${username}` : "Set a username first",
      href: username ? `/${username}` : "/settings",
      icon: Globe,
      completed: steps.hasPublicProfile,
    },
  ];

  const completedCount = onboardingSteps.filter((s) => s.completed).length;
  const totalCount = onboardingSteps.length;
  const allDone = completedCount === totalCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Don't show if dismissed or all done
  if (dismissed || allDone) return null;

  return (
    <div className="rounded-lg border-[0.5px] border-accent/30 bg-accent-light/20">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex size-[36px] items-center justify-center rounded-full bg-accent-light">
            <Sparkles size={18} className="text-accent" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-[15px] font-medium text-text-primary">
              Getting started
            </h2>
            <p className="text-[12px] text-text-secondary">
              {completedCount} of {totalCount} completed — {progressPercent}%
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex size-[28px] items-center justify-center rounded-md text-ash transition-colors hover:bg-surface-hover hover:text-text-primary"
          title="Dismiss"
        >
          <X size={14} strokeWidth={1.5} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 px-5">
        <div className="h-[4px] w-full overflow-hidden rounded-full bg-accent-light">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-4 px-3 pb-3">
        <div className="space-y-0.5">
          {onboardingSteps.map((step) => (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-center gap-3 rounded-md px-2 py-2 transition-colors duration-[120ms] ${
                step.completed
                  ? "opacity-60"
                  : "hover:bg-accent-light/50"
              }`}
            >
              {step.completed ? (
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-success"
                  strokeWidth={1.5}
                />
              ) : (
                <Circle
                  size={18}
                  className="shrink-0 text-accent/40"
                  strokeWidth={1.5}
                />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] font-medium ${
                    step.completed
                      ? "text-text-tertiary line-through"
                      : "text-text-primary"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-text-tertiary">{step.description}</p>
              </div>
              {!step.completed && (
                <ArrowRight size={13} className="shrink-0 text-ash" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
