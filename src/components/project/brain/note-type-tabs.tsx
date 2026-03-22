"use client";

import { FileText, Terminal, GitPullRequest } from "lucide-react";
import { cn } from "@/lib/utils";

const noteTypes = [
  { value: "ALL", label: "All notes", icon: FileText },
  { value: "PROMPT", label: "Prompts", icon: Terminal },
  { value: "ADR", label: "Decisions", icon: GitPullRequest },
  { value: "GENERAL", label: "Notes", icon: FileText },
] as const;

type NoteTypeTabsProps = {
  active: string;
  onChange: (type: string) => void;
  counts: Record<string, number>;
};

export function NoteTypeTabs({ active, onChange, counts }: NoteTypeTabsProps) {
  return (
    <div className="flex gap-1 rounded-md border-[0.5px] border-border bg-surface p-1">
      {noteTypes.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-[120ms]",
            active === type.value
              ? "bg-accent-light text-accent"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <type.icon size={14} strokeWidth={1.5} />
          <span>{type.label}</span>
          {counts[type.value] !== undefined && (
            <span className={cn(
              "ml-0.5 font-mono text-[10px]",
              active === type.value ? "text-accent/70" : "text-text-tertiary"
            )}>
              {counts[type.value]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
