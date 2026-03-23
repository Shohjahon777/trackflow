"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Terminal, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deleteNote } from "@/actions/note";
import { EditNoteDialog } from "./edit-note-dialog";

type PromptCardProps = {
  prompt: {
    id: string;
    title: string;
    content: string;
    type: string;
    tags: string[];
    usageCount: number;
    updatedAt: Date;
  };
};

export function PromptCard({ prompt }: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this prompt?")) return;
    setMenuOpen(false);
    startTransition(async () => {
      await deleteNote(prompt.id);
      router.refresh();
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Detect template variables like {{project_name}}
  const variables = prompt.content.match(/\{\{(\w+)\}\}/g) ?? [];
  const uniqueVars = [...new Set(variables)];

  return (
    <div className="group relative flex flex-col gap-3 rounded-md border-[0.5px] border-border bg-background p-4 transition-colors duration-[120ms] hover:border-accent-muted">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-[28px] shrink-0 items-center justify-center rounded-md bg-accent-light">
            <Terminal size={14} className="text-accent" strokeWidth={1.5} />
          </div>
          <h3 className="truncate text-[14px] font-medium text-text-primary">
            {prompt.title}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={cn(
              "flex size-[28px] items-center justify-center rounded-md transition-colors duration-[120ms]",
              copied
                ? "bg-success-bg text-success"
                : "text-ash opacity-0 group-hover:opacity-100 hover:bg-surface-hover hover:text-text-secondary"
            )}
          >
            {copied ? <Check size={14} strokeWidth={2} /> : <Copy size={14} strokeWidth={1.5} />}
          </button>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex size-[28px] items-center justify-center rounded-md text-ash opacity-0 transition-colors duration-[120ms] group-hover:opacity-100 hover:bg-surface-hover hover:text-text-secondary"
            >
              <MoreHorizontal size={14} strokeWidth={1.5} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-[32px] z-20 w-[140px] rounded-md border-[0.5px] border-border bg-background p-1 shadow-sm">
                  <button
                    onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  >
                    <Pencil size={13} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-danger transition-colors hover:bg-danger-bg"
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="rounded-md bg-surface px-3 py-2">
        <pre className="line-clamp-4 whitespace-pre-wrap font-mono text-[12px] leading-[1.6] text-text-body">
          {prompt.content}
        </pre>
      </div>

      {/* Template variables */}
      {uniqueVars.length > 0 && (
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-tertiary">Variables:</span>
          {uniqueVars.map((v) => (
            <span
              key={v}
              className="rounded-sm bg-warning-bg px-1.5 py-0.5 font-mono text-[10px] text-warning"
            >
              {v}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3">
        {prompt.tags.length > 0 && (
          <div className="flex gap-1">
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="tech">{tag}</Badge>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-3 text-[11px] text-text-tertiary">
          <span className="font-mono">{prompt.usageCount}× copied</span>
          <span className="font-mono">{prompt.updatedAt.toLocaleDateString()}</span>
        </div>
      </div>
      <EditNoteDialog
        note={{ id: prompt.id, title: prompt.title, content: prompt.content, type: prompt.type }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
