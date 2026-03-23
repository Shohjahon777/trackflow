"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="border-t border-border bg-surface px-6 py-24 md:px-12">
      <div ref={ref} className="mx-auto max-w-[560px] text-center opacity-0">
        <h2 className="text-[32px] font-medium leading-[1.15] text-text-primary md:text-[36px]">
          Start shipping with
          <br />
          <span className="text-accent">clarity</span>
        </h2>
        <p className="mt-4 text-[15px] leading-[1.7] text-text-secondary">
          Takes 30 seconds. Sign in with GitHub, and your repos are already
          there. Free tier is generous. Pro is $9/mo when you need it.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button size="lg">
              <Github size={16} />
              Get started free
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="secondary" size="lg">
              See pricing
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-[12px] text-text-tertiary">
          No credit card required. 5 projects free forever.
        </p>
      </div>
    </section>
  );
}
