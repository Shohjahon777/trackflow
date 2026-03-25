"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  { feature: "Multi-project overview", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Prompt library for AI tools", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Client share links (no login)", trackflow: true, notion: true, linear: false, github: false },
  { feature: "Public dev profile", trackflow: true, notion: false, linear: false, github: true },
  { feature: "Architecture decision records", trackflow: true, notion: true, linear: false, github: false },
  { feature: "Activity heatmap", trackflow: true, notion: false, linear: false, github: true },
  { feature: "Pomodoro timer per task", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Time tracking", trackflow: true, notion: false, linear: true, github: false },
  { feature: "Portfolio analytics", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Visitor regions tracking", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Built for solo builders", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Free tier — no credit card", trackflow: true, notion: true, linear: true, github: true },
];

export function Comparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header text staggers in
      const headerChildren = headerRef.current?.children;
      if (headerChildren) {
        gsap.fromTo(
          Array.from(headerChildren),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
          }
        );
      }

      // Table rows stagger in
      gsap.fromTo(
        ".comparison-row",
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: { trigger: tableRef.current, start: "top 85%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-t border-border px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[800px]">
        <div ref={headerRef}>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.04em] text-accent opacity-0">
            Comparison
          </p>
          <h2 className="mt-2 text-center text-[28px] font-medium leading-[1.15] text-text-primary opacity-0 md:text-[32px]">
            Why not just use Notion?
          </h2>
          <p className="mx-auto mt-3 max-w-[440px] text-center text-[14px] leading-[1.7] text-text-secondary opacity-0">
            Great tools, wrong job. They weren&apos;t built for solo builders shipping
            multiple projects who want a public profile.
          </p>
        </div>

        <div ref={tableRef} className="mt-10 overflow-hidden rounded-lg border-[0.5px] border-border">
          {/* Header */}
          <div className="flex h-[40px] items-center border-b border-border bg-surface text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <span className="flex-1 px-4">Feature</span>
            <span className="w-[80px] text-center font-mono text-accent">TrackFlow</span>
            <span className="w-[80px] text-center">Notion</span>
            <span className="w-[80px] text-center">Linear</span>
            <span className="w-[80px] text-center">GitHub</span>
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div
              key={row.feature}
              className="comparison-row flex h-[40px] items-center border-b-[0.5px] border-border last:border-0 text-[13px] opacity-0"
            >
              <span className="flex-1 px-4 text-text-body">{row.feature}</span>
              <Cell value={row.trackflow} highlight />
              <Cell value={row.notion} />
              <Cell value={row.linear} />
              <Cell value={row.github} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cell({ value, highlight }: { value: boolean; highlight?: boolean }) {
  return (
    <span className={`flex w-[80px] items-center justify-center ${highlight ? "bg-accent-light/50" : ""}`}>
      {value ? (
        <Check size={15} className={highlight ? "text-accent" : "text-success"} strokeWidth={2} />
      ) : (
        <X size={15} className="text-ash" strokeWidth={1.5} />
      )}
    </span>
  );
}
