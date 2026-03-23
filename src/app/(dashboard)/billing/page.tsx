import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { checkPlan } from "@/lib/plan";
import { PLANS } from "@/lib/stripe";
import { db } from "@/lib/db";
import { BillingView } from "@/components/billing/billing-view";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const [plan, projectCount, noteCount] = await Promise.all([
    checkPlan(userId),
    db.project.count({ where: { userId } }),
    db.note.count({ where: { project: { userId } } }),
  ]);

  return (
    <BillingView
      plan={plan}
      usage={{
        projects: projectCount,
        projectsLimit: plan.limits.projects === Infinity ? -1 : plan.limits.projects,
      }}
      plans={PLANS}
    />
  );
}
