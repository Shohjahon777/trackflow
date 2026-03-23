"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCheckoutSession, createPortalSession } from "@/lib/stripe";

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
