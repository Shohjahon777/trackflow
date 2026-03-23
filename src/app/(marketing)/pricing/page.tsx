import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/pricing-section";

export const metadata: Metadata = {
  title: "Pricing — TrackFlow",
  description:
    "Simple pricing for solo builders. Free tier is generous. Pro is $9/mo when you need it.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="pb-24 pt-16">
        <PricingSection />
      </div>
    </main>
  );
}
