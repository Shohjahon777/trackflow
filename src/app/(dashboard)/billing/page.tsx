import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { checkPlan } from "@/lib/plan";
import { PLANS } from "@/lib/stripe";
import { db } from "@/lib/db";
import { BillingView } from "@/components/billing/billing-view";
import { verifyCheckout } from "@/actions/billing";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const params = await searchParams;

  // After Stripe redirect — verify and activate the plan
  if (params.success === "true") {
    await verifyCheckout();
  }

  const [plan, projectCount] = await Promise.all([
    checkPlan(userId),
    db.project.count({ where: { userId } }),
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
