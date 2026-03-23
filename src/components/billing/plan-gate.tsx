"use client";

import Link from "next/link";
import { Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlanGateProps = {
  feature: string;
  isPro: boolean;
  children: React.ReactNode;
};

/**
 * Renders children for Pro users. Shows a subtle upgrade CTA for free users.
 * Usage: <PlanGate feature="bots" isPro={isPro}><BotManager /></PlanGate>
 */
export function PlanGate({ feature, isPro, children }: PlanGateProps) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="pointer-events-none select-none opacity-30 blur-[2px]">
        {children}
      </div>

      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex max-w-[320px] flex-col items-center rounded-lg border-[0.5px] border-accent/30 bg-card/95 p-6 text-center shadow-sm backdrop-blur-sm">
          <div className="flex size-[40px] items-center justify-center rounded-full bg-accent-light">
            <Lock size={18} className="text-accent" strokeWidth={1.5} />
          </div>
          <p className="mt-3 text-[14px] font-medium text-text-primary">
            {feature} is a Pro feature
          </p>
          <p className="mt-1 text-[12px] text-text-secondary">
            Upgrade to Pro to unlock {feature.toLowerCase()} and more.
          </p>
          <Link href="/billing" className="mt-4 w-full">
            <Button size="sm" className="w-full gap-1.5">
              <Zap size={14} />
              Upgrade to Pro
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline upgrade prompt — smaller, for use inside cards or lists.
 */
export function UpgradePrompt({ message }: { message: string }) {
  return (
    <Link
      href="/billing"
      className="flex items-center gap-2 rounded-md border-[0.5px] border-accent/20 bg-accent-light/30 px-3 py-2 text-[12px] text-accent transition-colors hover:border-accent/40 hover:bg-accent-light/50"
    >
      <Zap size={12} strokeWidth={1.5} />
      <span>{message}</span>
      <ArrowRight size={12} className="ml-auto" />
    </Link>
  );
}
