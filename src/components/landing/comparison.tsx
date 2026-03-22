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
  { feature: "Built for solo builders", trackflow: true, notion: false, linear: false, github: false },
  { feature: "Zero configuration", trackflow: true, notion: false, linear: false, github: true },
];

export function Comparison() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="border-t border-border px-6 py-24 md:px-12">
      <div ref={ref} className="mx-auto max-w-[800px] opacity-0">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.04em] text-accent">
          Comparison
        </p>
        <h2 className="mt-2 text-center text-[28px] font-medium leading-[1.15] text-text-primary md:text-[32px]">
          Why not just use Notion?
        </h2>
        <p className="mx-auto mt-3 max-w-[440px] text-center text-[14px] leading-[1.7] text-text-secondary">
          Great tools, wrong job. They weren't built for solo builders shipping
          multiple projects who want a public profile.
        </p>

        <div className="mt-10 overflow-hidden rounded-lg border-[0.5px] border-border">
          {/* Header */}
          <div className="flex h-[40px] items-center border-b border-border bg-surface text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            <span className="flex-1 px-4">Feature</span>
            <span className="w-[80px] text-center font-mono text-accent">TrackFlow</span>
            <span className="w-[80px] text-center">Notion</span>
            <span className="w-[80px] text-center">Linear</span>
            <span className="w-[80px] text-center">GitHub</span>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className="flex h-[40px] items-center border-b-[0.5px] border-border last:border-0 text-[13px]"
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
