import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Add it to your .env file."
      );
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = {
  free: {
    name: "Free",
    description: "For solo builders getting started",
    price: { monthly: 0, annual: 0 },
    limits: {
      projects: 5,
      notesPerProject: 10,
      shareLinksPerProject: 1,
    },
  },
  pro: {
    name: "Pro",
    description: "For power builders who ship fast",
    price: { monthly: 9, annual: 84 },
    stripePriceId: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
      annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID!,
    },
    limits: {
      projects: Infinity,
      notesPerProject: Infinity,
      shareLinksPerProject: Infinity,
    },
  },
} as const;

export async function createCheckoutSession({
  userId,
  userEmail,
  billingCycle = "monthly",
}: {
  userId: string;
  userEmail: string;
  billingCycle?: "monthly" | "annual";
}) {
  const priceId = PLANS.pro.stripePriceId[billingCycle];

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?cancelled=true`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return session;
}

export async function createPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  return session;
}
