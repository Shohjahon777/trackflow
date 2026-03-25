"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/landing/dashboard-preview";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge pops in first
      tl.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 }
      )
        // Headline words animate in
        .fromTo(
          headlineRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9 },
          "-=0.2"
        )
        .fromTo(
          subtextRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )
        // Preview scales up with a perspective feel
        .fromTo(
          previewRef.current,
          { y: 80, opacity: 0, scale: 0.92 },
          { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=0.4"
        );

      // Subtle floating animation on the background gradients
      gsap.to(".hero-gradient-1", {
        scale: 1.05,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".hero-gradient-2", {
        x: 30,
        y: -20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden px-6 pt-24 pb-0 md:px-12 md:pt-32">
      {/* Animated background gradients */}
      <div className="hero-gradient-1 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-5%,var(--accent-light),transparent)]" />
      <div className="hero-gradient-2 pointer-events-none absolute inset-0 bg-[radial-gradient(circle_600px_at_70%_80%,var(--accent-light)_0%,transparent_70%)] opacity-30" />

      <div className="relative mx-auto max-w-[1120px]">
        {/* Text */}
        <div className="mx-auto max-w-[640px] text-center">
          {/* Status badge */}
          <div ref={badgeRef} className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border-[0.5px] border-border bg-surface px-3 py-1.5 opacity-0">
            <span className="relative flex size-[6px]">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-[6px] rounded-full bg-success" />
            </span>
            <span className="text-[12px] text-text-secondary">Now with pomodoro timer and analytics</span>
          </div>

          <h1
            ref={headlineRef}
            className="text-[40px] font-medium leading-[1.1] tracking-tight text-text-primary opacity-0 md:text-[56px]"
          >
            One dashboard for
            <br />
            <span className="text-accent">everything you ship</span>
          </h1>

          <p
            ref={subtextRef}
            className="mx-auto mt-5 max-w-[460px] text-[16px] leading-[1.7] text-text-secondary opacity-0"
          >
            Stop losing context across projects. TrackFlow gives you a command
            center, focus timer, client sharing, and a live portfolio that proves what you build.
          </p>

          <div ref={ctaRef} className="mt-8 flex items-center justify-center gap-3 opacity-0">
            <Link href="/login">
              <Button size="lg">
                <Github size={16} />
                Start with GitHub
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                See features
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Live dashboard preview */}
        <div
          ref={previewRef}
          className="relative mt-16 opacity-0"
        >
          {/* Browser chrome */}
          <div className="overflow-hidden rounded-t-xl border-[0.5px] border-border/80 bg-surface shadow-[0_20px_70px_-10px_rgba(99,102,160,0.15)]">
            {/* Title bar */}
            <div className="flex h-[38px] items-center gap-2 border-b border-border px-4 bg-surface">
              <div className="flex gap-1.5">
                <span className="size-[10px] rounded-full bg-[#EC6A5E]" />
                <span className="size-[10px] rounded-full bg-[#F4BF4F]" />
                <span className="size-[10px] rounded-full bg-[#61C554]" />
              </div>
              <div className="mx-auto flex h-[24px] items-center rounded-md bg-fog px-4 text-[11px] text-text-tertiary dark:bg-surface-hover">
                <span className="mr-1 size-[8px] rounded-full bg-success" />
                trackflow.dev/overview
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Dashboard content */}
            <DashboardPreview />
          </div>

          {/* Fade out at bottom */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}
