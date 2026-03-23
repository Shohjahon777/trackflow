"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Github, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

const freePlan = {
  name: "Free",
  price: "$0",
  period: "forever",
  description: "Everything you need to start shipping.",
  features: [
    "Up to 5 projects",
    "Public developer profile",
    "Activity heatmap",
    "Project brain (10 notes/project)",
    "1 client share link per project",
    "GitHub integration",
    "Time & cost tracking",
  ],
};

const proPlan = {
  name: "Pro",
  price: "$9",
  period: "/mo",
  description: "For builders who ship seriously.",
  features: [
    "Unlimited projects",
    "Unlimited brain notes",
    "Unlimited share links",
    "Bot assistants (Telegram, Slack, Discord)",
    "AI context generator",
    "Cross-project search (Cmd+K)",
    "Portfolio analytics",
    "Client portal + custom domain",
    "Advanced time reports + PDF export",
    "Custom OG image themes",
    "Pinned projects on profile",
    "Remove TrackFlow branding",
    "Priority support",
  ],
};

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 75%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" className="scroll-mt-[48px] border-t border-border px-6 py-24 md:px-12">
      <div ref={ref} className="mx-auto max-w-[860px]">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.04em] text-accent">
          Pricing
        </p>
        <h2 className="mt-2 text-center text-[28px] font-medium leading-[1.15] text-text-primary md:text-[32px]">
          Simple, honest pricing
        </h2>
        <p className="mx-auto mt-3 max-w-[400px] text-center text-[14px] leading-[1.7] text-text-secondary">
          Start free. Upgrade when you need power features.
          No surprises, cancel anytime.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {/* Free plan */}
          <div className="pricing-card flex flex-col rounded-lg border-[0.5px] border-border bg-surface p-6 opacity-0">
            <div>
              <h3 className="text-[18px] font-medium text-text-primary">{freePlan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-[36px] font-medium leading-none text-text-primary">
                  {freePlan.price}
                </span>
                <span className="text-[14px] text-text-tertiary">{freePlan.period}</span>
              </div>
              <p className="mt-2 text-[13px] text-text-secondary">{freePlan.description}</p>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {freePlan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-success" strokeWidth={2} />
                  <span className="text-[13px] text-text-body">{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/login" className="mt-8">
              <Button variant="secondary" className="w-full">
                <Github size={14} />
                Start free
              </Button>
            </Link>
          </div>

          {/* Pro plan */}
          <div className="pricing-card relative flex flex-col rounded-lg border-[0.5px] border-accent bg-surface p-6 opacity-0 shadow-[0_0_0_1px_var(--accent-light)]">
            {/* Popular badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-cloud">
                <Zap size={11} strokeWidth={2} />
                Most popular
              </span>
            </div>

            <div>
              <h3 className="text-[18px] font-medium text-text-primary">{proPlan.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-[36px] font-medium leading-none text-accent">
                  {proPlan.price}
                </span>
                <span className="text-[14px] text-text-tertiary">{proPlan.period}</span>
              </div>
              <p className="mt-2 text-[13px] text-text-secondary">{proPlan.description}</p>
            </div>

            <ul className="mt-6 flex-1 space-y-2.5">
              {proPlan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent" strokeWidth={2} />
                  <span className="text-[13px] text-text-body">{f}</span>
                </li>
              ))}
            </ul>

            <Link href="/login" className="mt-8">
              <Button className="w-full">
                Get Pro
                <ArrowRight size={14} />
              </Button>
            </Link>

            <p className="mt-3 text-center text-[11px] text-text-tertiary">
              7-day free trial. Cancel anytime.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 space-y-6">
          <h3 className="text-center text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Frequently asked questions
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FaqItem
              q="Can I cancel anytime?"
              a="Yes. Cancel from your billing page. You keep Pro features until the end of your billing cycle."
            />
            <FaqItem
              q="What happens to my data if I downgrade?"
              a="Nothing is deleted. Limits re-apply — extra projects become read-only, bot connections pause (not removed)."
            />
            <FaqItem
              q="Is there an annual discount?"
              a="Coming soon. Annual plans will save you 2 months (pay for 10, get 12)."
            />
            <FaqItem
              q="Do I need a credit card to start?"
              a="No. The free tier works with just a GitHub sign-in. No card required."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
      <p className="text-[13px] font-medium text-text-primary">{q}</p>
      <p className="mt-1.5 text-[12px] leading-[1.6] text-text-secondary">{a}</p>
    </div>
  );
}
