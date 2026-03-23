"use client";

import { useTransition } from "react";
import {
  Zap,
  Check,
  CreditCard,
  ExternalLink,
  AlertCircle,
  Crown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckout, openPortal } from "@/actions/billing";
import type { PlanInfo } from "@/lib/plan";

type BillingViewProps = {
  plan: PlanInfo;
  usage: {
    projects: number;
    projectsLimit: number;
  };
  plans: {
    free: { name: string; description: string; price: { monthly: number; annual: number } };
    pro: { name: string; description: string; price: { monthly: number; annual: number } };
  };
};

const proFeatures = [
  "Unlimited projects",
  "Unlimited brain notes",
  "Unlimited share links",
  "Bot assistants (Telegram, Slack, Discord)",
  "Portfolio analytics",
  "AI context generator",
  "Cross-project search (Cmd+K)",
  "Advanced time reports + PDF export",
  "Custom OG image themes",
  "Pinned projects on profile",
  "Remove TrackFlow branding",
  "Priority support",
];

const freeFeatures = [
  "Up to 5 projects",
  "Public profile",
  "GitHub integration",
  "Activity heatmap",
  "1 share link per project",
  "10 brain notes per project",
  "Basic time logging",
];

export function BillingView({ plan, usage, plans }: BillingViewProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpgrade = (cycle: "monthly" | "annual") => {
    startTransition(() => createCheckout(cycle));
  };

  const handleManage = () => {
    startTransition(() => openPortal());
  };

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-medium text-text-primary">Billing</h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Manage your plan, usage, and payment method.
        </p>
      </div>

      {/* Current plan card */}
      <div className="mt-8 rounded-lg border-[0.5px] border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex size-[40px] items-center justify-center rounded-full ${
                plan.isPro ? "bg-accent-light" : "bg-surface"
              }`}
            >
              {plan.isPro ? (
                <Crown size={18} className="text-accent" strokeWidth={1.5} />
              ) : (
                <CreditCard size={18} className="text-text-secondary" strokeWidth={1.5} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-medium text-text-primary">
                  {plan.isPro ? "Pro" : "Free"} plan
                </h2>
                {plan.isPro && (
                  <span className="rounded-md bg-accent-light px-2 py-0.5 text-[11px] font-medium text-accent">
                    Active
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-[13px] text-text-secondary">
                {plan.isPro
                  ? `$${plans.pro.price.monthly}/mo — renews ${
                      plan.currentPeriodEnd
                        ? new Date(plan.currentPeriodEnd).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "soon"
                    }`
                  : "Free forever — no credit card required"}
              </p>
            </div>
          </div>

          {plan.isPro && plan.stripeCustomerId && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleManage}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ExternalLink size={14} />
              )}
              Manage subscription
            </Button>
          )}
        </div>

        {plan.cancelAtPeriodEnd && (
          <div className="mt-4 flex items-center gap-2 rounded-md border-[0.5px] border-warning/30 bg-warning-light px-3 py-2 text-[13px] text-warning-text">
            <AlertCircle size={14} strokeWidth={1.5} />
            Your plan will downgrade to Free at the end of the current billing period.
          </div>
        )}

        {plan.status === "PAST_DUE" && (
          <div className="mt-4 flex items-center gap-2 rounded-md border-[0.5px] border-danger/30 bg-danger-light px-3 py-2 text-[13px] text-danger-text">
            <AlertCircle size={14} strokeWidth={1.5} />
            Payment failed. Please update your payment method to keep Pro features.
          </div>
        )}
      </div>

      {/* Usage */}
      <div className="mt-6 rounded-lg border-[0.5px] border-border bg-card p-6">
        <h3 className="text-[14px] font-medium text-text-primary">Usage</h3>
        <div className="mt-4 space-y-4">
          <UsageBar
            label="Projects"
            current={usage.projects}
            limit={usage.projectsLimit}
          />
        </div>
      </div>

      {/* Upgrade section — only show for free users */}
      {!plan.isPro && (
        <div className="mt-8">
          <h3 className="text-[14px] font-medium text-text-primary">
            Upgrade to Pro
          </h3>
          <p className="mt-1 text-[13px] text-text-secondary">
            Unlock the full power of TrackFlow.
          </p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Monthly */}
            <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
              <p className="text-[13px] font-medium text-text-secondary">Monthly</p>
              <p className="mt-2 text-[32px] font-medium text-text-primary">
                $9<span className="text-[14px] text-text-tertiary">/mo</span>
              </p>
              <Button
                onClick={() => handleUpgrade("monthly")}
                disabled={isPending}
                className="mt-4 w-full gap-1.5"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                Upgrade monthly
              </Button>
            </div>

            {/* Annual */}
            <div className="relative rounded-lg border-[0.5px] border-accent/40 bg-card p-6">
              <span className="absolute -top-3 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-medium text-white">
                Save $24/yr
              </span>
              <p className="text-[13px] font-medium text-text-secondary">Annual</p>
              <p className="mt-2 text-[32px] font-medium text-text-primary">
                $7<span className="text-[14px] text-text-tertiary">/mo</span>
              </p>
              <p className="mt-0.5 text-[12px] text-text-tertiary">$84 billed annually</p>
              <Button
                onClick={() => handleUpgrade("annual")}
                disabled={isPending}
                className="mt-4 w-full gap-1.5"
              >
                {isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                Upgrade annually
              </Button>
            </div>
          </div>

          {/* Feature comparison */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Free includes
              </p>
              <ul className="mt-3 space-y-2">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-text-secondary">
                    <Check size={14} className="shrink-0 text-success" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Everything in Free, plus
              </p>
              <ul className="mt-3 space-y-2">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-text-secondary">
                    <Check size={14} className="shrink-0 text-accent" strokeWidth={1.5} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UsageBar({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">{label}</span>
        <span className="font-mono text-[12px] text-text-tertiary">
          {current} {isUnlimited ? "(unlimited)" : `/ ${limit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="mt-1.5 h-[4px] w-full overflow-hidden rounded-full bg-surface">
          <div
            className={`h-full rounded-full transition-all ${
              isNearLimit ? "bg-warning" : "bg-accent"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
