"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutSession, createPortalSession, getStripe } from "@/lib/stripe";

export async function createCheckout(billingCycle: "monthly" | "annual" = "monthly") {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new Error("Not authenticated");
  }

  // Check if user already has a plan with stripe customer
  const plan = await db.plan.findUnique({
    where: { userId: session.user.id },
  });

  if (plan?.type === "PRO" && plan.status === "ACTIVE") {
    redirect("/billing");
  }

  const checkoutSession = await createCheckoutSession({
    userId: session.user.id,
    userEmail: session.user.email,
    billingCycle,
  });

  if (!checkoutSession.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(checkoutSession.url);
}

/**
 * Verify a completed checkout session and activate the Pro plan.
 * Called when Stripe redirects back with ?success=true.
 * This replaces the webhook for plan activation.
 */
export async function verifyCheckout() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  // Already Pro — nothing to do
  const existingPlan = await db.plan.findUnique({
    where: { userId: session.user.id },
  });
  if (existingPlan?.type === "PRO" && existingPlan.status === "ACTIVE") {
    return { success: true, alreadyActive: true };
  }

  // Find the most recent completed checkout session for this user
  const stripe = getStripe();
  const sessions = await stripe.checkout.sessions.list({
    limit: 5,
  });

  const completedSession = sessions.data.find(
    (s) =>
      s.metadata?.userId === session.user!.id &&
      s.status === "complete" &&
      s.subscription
  );

  if (!completedSession) {
    return { error: "No completed checkout found. Please try again." };
  }

  const subscriptionId =
    typeof completedSession.subscription === "string"
      ? completedSession.subscription
      : completedSession.subscription?.id;

  if (!subscriptionId) {
    return { error: "No subscription found in checkout session." };
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const periodEnd = subscription.items.data[0]?.current_period_end;
  const billingInterval = subscription.items.data[0]?.price?.recurring?.interval;

  await db.plan.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      type: "PRO",
      status: "ACTIVE",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      billingCycle: billingInterval === "year" ? "ANNUAL" : "MONTHLY",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    },
    update: {
      type: "PRO",
      status: "ACTIVE",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      billingCycle: billingInterval === "year" ? "ANNUAL" : "MONTHLY",
      currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    },
  });

  return { success: true };
}

export async function openPortal() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const plan = await db.plan.findUnique({
    where: { userId: session.user.id },
  });

  if (!plan?.stripeCustomerId) {
    redirect("/billing");
  }

  const portalSession = await createPortalSession(plan.stripeCustomerId);
  redirect(portalSession.url);
}
