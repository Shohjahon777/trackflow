"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main content fade in
      gsap.fromTo(
        ".cta-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        }
      );

      // Floating particles
      gsap.utils.toArray<HTMLElement>(".cta-particle").forEach((el, i) => {
        gsap.to(el, {
          y: `random(-20, 20)`,
          x: `random(-15, 15)`,
          duration: 3 + i * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.3,
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-border bg-surface px-6 py-24 md:px-12">
      {/* Ambient particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="cta-particle absolute left-[15%] top-[20%] size-[4px] rounded-full bg-accent/20" />
        <div className="cta-particle absolute left-[75%] top-[30%] size-[3px] rounded-full bg-accent/15" />
        <div className="cta-particle absolute left-[40%] top-[70%] size-[5px] rounded-full bg-accent/10" />
        <div className="cta-particle absolute left-[85%] top-[60%] size-[3px] rounded-full bg-accent/20" />
        <div className="cta-particle absolute left-[25%] top-[80%] size-[4px] rounded-full bg-accent/15" />
      </div>

      <div className="cta-content mx-auto max-w-[560px] text-center opacity-0">
        <div className="mx-auto mb-6 flex size-[48px] items-center justify-center rounded-xl bg-accent-light">
          <Sparkles size={22} className="text-accent" strokeWidth={1.5} />
        </div>
        <h2 className="text-[32px] font-medium leading-[1.15] text-text-primary md:text-[36px]">
          Start shipping with
          <br />
          <span className="text-accent">clarity</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.7] text-text-secondary">
          Takes 30 seconds. Sign in with GitHub, and your repos are already
          there. Track time, share with clients, build your portfolio.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg">
              <Github size={16} />
              Get started free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" size="lg">
              See features
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-[12px] text-text-tertiary">
          No credit card required. Free forever for solo builders.
        </p>
      </div>
    </section>
  );
}
