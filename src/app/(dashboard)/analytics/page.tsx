import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { checkPlan } from "@/lib/plan";
import { getAnalytics } from "@/lib/analytics";
import { AnalyticsView } from "@/components/analytics/analytics-view";
import { PlanGate } from "@/components/billing/plan-gate";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const plan = await checkPlan(userId);

  if (!plan.isPro) {
    return (
      <div className="mx-auto max-w-[960px] px-6 py-8">
        <h1 className="text-[20px] font-medium text-text-primary">Analytics</h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Track who's viewing your profile and clicking your projects.
        </p>
        <div className="mt-8">
          <PlanGate feature="Portfolio analytics" isPro={false}>
            <AnalyticsPlaceholder />
          </PlanGate>
        </div>
      </div>
    );
  }

  const analytics = await getAnalytics(userId, 30);

  return <AnalyticsView data={analytics} />;
}

function AnalyticsPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <p className="text-[12px] text-text-tertiary">Profile views</p>
          <p className="mt-2 text-[28px] font-medium text-text-primary">--</p>
        </div>
        <div className="rounded-lg border-[0.5px] border-border bg-card p-6">
          <p className="text-[12px] text-text-tertiary">Project clicks</p>
          <p className="mt-2 text-[28px] font-medium text-text-primary">--</p>
        </div>
      </div>
      <div className="h-[200px] rounded-lg border-[0.5px] border-border bg-card" />
    </div>
  );
}
