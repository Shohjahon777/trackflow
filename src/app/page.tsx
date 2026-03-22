import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { FeatureSections } from "@/components/landing/feature-sections";
import { Comparison } from "@/components/landing/comparison";
import { CtaSection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 flex h-[48px] items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md md:px-12">
        <Link href="/" className="font-mono text-[14px] font-medium text-text-primary">
          TRACK<span className="text-accent">FLOW</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link href="/login">
            <Button size="sm">
              Get started
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero with live dashboard */}
      <Hero />

      {/* Feature sections with real UI */}
      <FeatureSections />

      {/* Comparison table */}
      <Comparison />

      {/* Final CTA */}
      <CtaSection />

      {/* Footer */}
      <footer className="border-t border-border px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between">
          <span className="font-mono text-[12px] text-text-tertiary">
            TRACK<span className="text-accent">FLOW</span>
          </span>
          <p className="text-[11px] text-ash">
            Built by builders, for builders.
          </p>
        </div>
      </footer>
    </div>
  );
}
