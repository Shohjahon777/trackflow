import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Helper to extract period end from subscription items
function getPeriodEnd(subscription: Stripe.Subscription): Date {
  const item = subscription.items.data[0];
  if (item?.current_period_end) {
    return new Date(item.current_period_end * 1000);
  }
  // Fallback
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

function getBillingCycle(subscription: Stripe.Subscription): "ANNUAL" | "MONTHLY" {
  return subscription.items.data[0]?.price.recurring?.interval === "year"
    ? "ANNUAL"
    : "MONTHLY";
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        if (!subscriptionId) break;

        const subResponse = await getStripe().subscriptions.retrieve(subscriptionId);
        const subscription = subResponse as unknown as Stripe.Subscription;

        await db.plan.upsert({
          where: { userId },
          create: {
            userId,
            type: "PRO",
            status: "ACTIVE",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            billingCycle: getBillingCycle(subscription),
            currentPeriodEnd: getPeriodEnd(subscription),
          },
          update: {
            type: "PRO",
            status: "ACTIVE",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: subscription.items.data[0]?.price.id,
            billingCycle: getBillingCycle(subscription),
            currentPeriodEnd: getPeriodEnd(subscription),
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        const statusMap: Record<string, "ACTIVE" | "PAST_DUE" | "CANCELLED" | "UNPAID"> = {
          active: "ACTIVE",
          past_due: "PAST_DUE",
          canceled: "CANCELLED",
          unpaid: "UNPAID",
        };

        await db.plan.update({
          where: { userId },
          data: {
            status: statusMap[subscription.status] ?? "ACTIVE",
            currentPeriodEnd: getPeriodEnd(subscription),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            stripePriceId: subscription.items.data[0]?.price.id,
            billingCycle: getBillingCycle(subscription),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        if (!userId) break;

        await db.plan.update({
          where: { userId },
          data: {
            type: "FREE",
            status: "CANCELLED",
            cancelAtPeriodEnd: false,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        // In Stripe v20+, subscription is accessed via parent
        const invoice = event.data.object as Stripe.Invoice;
        const parent = invoice.parent as { subscription_details?: { subscription?: string } } | null;
        const subscriptionId = parent?.subscription_details?.subscription;

        if (!subscriptionId) break;

        await db.plan.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "PAST_DUE" },
        });
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
