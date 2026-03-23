"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, ArrowRight, FolderKanban, Brain, Share2, UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type WelcomeDialogProps = {
  userName: string;
  open: boolean;
};

const steps = [
  {
    icon: UserCircle,
    title: "Set up your profile",
    description: "Add a username and bio so your public profile is ready to share.",
    href: "/settings",
  },
  {
    icon: FolderKanban,
    title: "Create your first project",
    description: "Add a project to start tracking. Link a GitHub repo if you have one.",
    href: "/projects",
  },
  {
    icon: Brain,
    title: "Save a brain note",
    description: "Architecture decisions, prompts, or notes — never lose context again.",
    href: "/brain",
  },
  {
    icon: Share2,
    title: "Share with a client",
    description: "Generate a read-only link to show project status without the chaos.",
    href: "/shares",
  },
];

export function WelcomeDialog({ userName, open: initialOpen }: WelcomeDialogProps) {
  const [open, setOpen] = useState(initialOpen);

  const firstName = userName?.split(" ")[0] ?? "there";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <div className="flex size-[48px] items-center justify-center rounded-full bg-accent-light">
            <Rocket size={24} className="text-accent" strokeWidth={1.5} />
          </div>
          <DialogTitle className="mt-4 text-[20px]">
            Welcome, {firstName}
          </DialogTitle>
          <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">
            Your command center is ready. Here's how to get the most out of TrackFlow in a few minutes.
          </p>
        </DialogHeader>

        <div className="mt-2 space-y-2">
          {steps.map((step, i) => (
            <Link
              key={step.title}
              href={step.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 rounded-md border-[0.5px] border-border p-3 transition-colors duration-[120ms] hover:border-accent-muted hover:bg-accent-light/30"
            >
              <div className="flex size-[32px] shrink-0 items-center justify-center rounded-md bg-surface">
                <step.icon size={16} className="text-accent" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-text-primary">
                  <span className="mr-1.5 font-mono text-[11px] text-text-tertiary">{i + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-0.5 text-[12px] text-text-secondary">
                  {step.description}
                </p>
              </div>
              <ArrowRight size={14} className="mt-1 shrink-0 text-ash" />
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setOpen(false)}
            className="text-[12px] text-text-tertiary transition-colors hover:text-text-primary"
          >
            I'll explore on my own
          </button>
          <Link href="/projects" onClick={() => setOpen(false)}>
            <Button size="sm">
              Create a project
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
