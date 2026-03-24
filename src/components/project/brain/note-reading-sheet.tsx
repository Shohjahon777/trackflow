"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { FileText, Terminal, GitPullRequest, Pencil } from "lucide-react";

type NoteReadingSheetProps = {
  note: {
    id: string;
    title: string;
    content: string;
    type: string;
    updatedAt: Date;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
};

const typeIcon = {
  GENERAL: FileText,
  PROMPT: Terminal,
  ADR: GitPullRequest,
} as const;

const typeLabel: Record<string, string> = {
  GENERAL: "note",
  PROMPT: "prompt",
  ADR: "decision",
};

function parseAdrContent(content: string) {
  const contextMatch = content.match(/## Context\n([\s\S]*?)(?=\n## Decision|$)/);
  const decisionMatch = content.match(/## Decision\n([\s\S]*?)$/);
  return {
    context: contextMatch?.[1]?.trim() ?? null,
    decision: decisionMatch?.[1]?.trim() ?? null,
    raw: content,
  };
}

export function NoteReadingSheet({
  note,
  open,
  onOpenChange,
  onEdit,
}: NoteReadingSheetProps) {
  const Icon = typeIcon[note.type as keyof typeof typeIcon] ?? FileText;
  const isAdr = note.type === "ADR";
  const isPrompt = note.type === "PROMPT";

  const adr = isAdr ? parseAdrContent(note.content) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[560px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="sr-only">{note.title}</SheetTitle>
          <SheetDescription className="sr-only">Reading note</SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 shrink-0 text-text-tertiary" />
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-medium leading-[1.3] text-text-primary">
                {note.title}
              </h2>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge variant="neutral">{typeLabel[note.type] ?? note.type.toLowerCase()}</Badge>
                <span className="font-mono text-[11px] text-text-tertiary">
                  Updated {new Date(note.updatedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex shrink-0 items-center gap-1.5 rounded-md border-[0.5px] border-border px-2.5 py-1.5 text-[12px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
              >
                <Pencil size={13} strokeWidth={1.5} />
                Edit
              </button>
            )}
          </div>

          {/* Content */}
          <div className="mt-6">
            {isAdr && adr?.context ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                    Context
                  </span>
                  <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-[1.7] text-text-primary">
                    {adr.context}
                  </p>
                </div>
                {adr.decision && (
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                      Decision
                    </span>
                    <p className="mt-1.5 whitespace-pre-wrap text-[14px] leading-[1.7] text-text-primary">
                      {adr.decision}
                    </p>
                  </div>
                )}
              </div>
            ) : isPrompt ? (
              <pre className="overflow-x-auto rounded-md border-[0.5px] border-border bg-surface p-4 font-mono text-[13px] leading-[1.6] text-text-primary">
                {note.content}
              </pre>
            ) : (
              <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-text-primary">
                {note.content}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
