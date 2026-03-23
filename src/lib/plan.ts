import { db } from "@/lib/db";
import { PLANS } from "@/lib/stripe";

export type PlanInfo = {
  isPro: boolean;
  type: "FREE" | "PRO";
  limits: {
    projects: number;
    notesPerProject: number;
    shareLinksPerProject: number;
  };
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
};

export async function checkPlan(userId: string): Promise<PlanInfo> {
  const plan = await db.plan.findUnique({
    where: { userId },
  });

  // No plan record or FREE plan
  if (!plan || plan.type === "FREE") {
    return {
      isPro: false,
      type: "FREE",
      limits: PLANS.free.limits,
      status: "ACTIVE",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      stripeCustomerId: null,
    };
  }

  // PRO plan — check if active
  const isActive = plan.status === "ACTIVE" || plan.status === "PAST_DUE";
  const notExpired = plan.currentPeriodEnd
    ? plan.currentPeriodEnd > new Date()
    : true;

  if (isActive && notExpired) {
    return {
      isPro: true,
      type: "PRO",
      limits: PLANS.pro.limits,
      status: plan.status,
      currentPeriodEnd: plan.currentPeriodEnd,
      cancelAtPeriodEnd: plan.cancelAtPeriodEnd,
      stripeCustomerId: plan.stripeCustomerId,
    };
  }

  // Expired or cancelled — treat as free
  return {
    isPro: false,
    type: "FREE",
    limits: PLANS.free.limits,
    status: plan.status,
    currentPeriodEnd: plan.currentPeriodEnd,
    cancelAtPeriodEnd: plan.cancelAtPeriodEnd,
    stripeCustomerId: plan.stripeCustomerId,
  };
}

export async function isPro(userId: string): Promise<boolean> {
  const plan = await checkPlan(userId);
  return plan.isPro;
}

export function getPlanLimits(planType: "FREE" | "PRO") {
  return planType === "PRO" ? PLANS.pro.limits : PLANS.free.limits;
}

/**
 * Check if user has reached a specific limit.
 * Returns { allowed: boolean, current: number, limit: number }
 */
export async function checkLimit(
  userId: string,
  resource: "projects" | "notesPerProject" | "shareLinksPerProject",
  currentCount: number
) {
  const plan = await checkPlan(userId);
  const limit = plan.limits[resource];

  return {
    allowed: currentCount < limit,
    current: currentCount,
    limit: limit === Infinity ? -1 : limit,
    isPro: plan.isPro,
  };
}
