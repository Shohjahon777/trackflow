"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type FeatureItem = {
  label: string;
  done: boolean;
};

type ComingSoonProps = {
  feature: string;
  description: string;
  items: FeatureItem[];
  /** Optional ghost content to blur behind the overlay */
  children?: React.ReactNode;
};

const TYPING_TEXT = "// building in progress";

export function ComingSoon({ feature, description, items, children }: ComingSoonProps) {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (typed.length < TYPING_TEXT.length) {
      const t = setTimeout(() => setTyped(TYPING_TEXT.slice(0, typed.length + 1)), 38);
      return () => clearTimeout(t);
    }
  }, [typed]);

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(t);
  }, []);

  const done = items.filter((i) => i.done).length;
  const progress = Math.round((done / items.length) * 100);

  return (
    <div className="relative">
      {/* Ghost content blurred behind */}
      {children && (
        <div
          className="pointer-events-none select-none"
          aria-hidden
          style={{ filter: "blur(6px)", opacity: 0.25 }}
        >
          {children}
        </div>
      )}

      {/* Overlay */}
      <div
        className={cn(
          "flex items-center justify-center",
          children
            ? "absolute inset-0"
            : "min-h-[480px]"
        )}
      >
        <div className="w-full max-w-[480px] rounded-lg border-[0.5px] border-border bg-surface px-8 py-8 shadow-sm">

          {/* Terminal header */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-[10px] rounded-full bg-border" />
              <span className="size-[10px] rounded-full bg-border" />
              <span className="size-[10px] rounded-full bg-border" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-text-tertiary">
              trackflow ~ {feature.toLowerCase().replace(/\s+/g, "-")}
            </span>
          </div>

          {/* Typewriter line */}
          <p className="font-mono text-[13px] text-accent">
            {typed}
            <span
              className="inline-block w-[7px] h-[13px] ml-[2px] align-middle bg-accent transition-opacity"
              style={{ opacity: showCursor ? 1 : 0 }}
            />
          </p>

          {/* Feature name */}
          <h2 className="mt-5 text-[20px] font-medium text-text-primary">
            {feature}
          </h2>
          <p className="mt-1.5 text-[14px] leading-[1.6] text-text-secondary">
            {description}
          </p>

          {/* Progress bar */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                Progress
              </span>
              <span className="font-mono text-[11px] text-text-tertiary">
                {done}/{items.length} done
              </span>
            </div>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-fog dark:bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Feature checklist */}
          <ul className="mt-5 space-y-2.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-[16px] shrink-0 items-center justify-center rounded-sm border-[0.5px] font-mono text-[10px]",
                    item.done
                      ? "border-[#3D8B6E]/40 bg-[#EBF3EE] text-[#3D8B6E] dark:border-[#5DBF8E]/30 dark:bg-[#1A2E24] dark:text-[#5DBF8E]"
                      : "border-border text-text-tertiary"
                  )}
                >
                  {item.done ? "✓" : "·"}
                </span>
                <span
                  className={cn(
                    "text-[13px]",
                    item.done ? "text-text-secondary line-through decoration-text-tertiary" : "text-text-primary"
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {/* Footer note */}
          <p className="mt-6 border-t-[0.5px] border-border pt-4 font-mono text-[11px] text-text-tertiary">
            $ this feature is actively being built
          </p>
        </div>
      </div>
    </div>
  );
}
