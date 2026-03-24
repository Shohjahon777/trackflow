"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Terminal, GitPullRequest, Brain, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NoteReadingSheet } from "../brain/note-reading-sheet";

type Note = {
  id: string;
  title: string;
  content: string;
  type: string;
  updatedAt: Date;
};

type BrainTabProps = {
  notes: Note[];
  projectId: string;
};

const typeIcon = {
  GENERAL: FileText,
  PROMPT: Terminal,
  ADR: GitPullRequest,
} as const;

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export function BrainTab({ notes, projectId }: BrainTabProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="space-y-4">
      {/* Link to full brain page */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Project notes
        </span>
        <Link
          href="/brain"
          className="flex items-center gap-1 text-[12px] text-accent transition-colors hover:text-accent/80"
        >
          Open brain
          <ArrowRight size={12} />
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Brain size={24} className="mb-2 text-text-tertiary" />
          <p className="text-[14px] text-text-secondary">No notes yet</p>
          <p className="mt-1 max-w-[320px] text-[12px] leading-[1.6] text-text-tertiary">
            Go to the Brain section to add notes, architecture decisions, and saved prompts. Click any note to read its full content.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => {
            const Icon = typeIcon[note.type as keyof typeof typeIcon] ?? FileText;
            return (
              <div
                key={note.id}
                className="cursor-pointer rounded-md border-[0.5px] border-border p-3 transition-colors hover:bg-surface"
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex items-center gap-2">
                  <Icon size={14} className="shrink-0 text-text-tertiary" />
                  <span className="flex-1 text-[13px] font-medium text-text-primary">
                    {note.title}
                  </span>
                  <Badge variant="neutral">{note.type.toLowerCase()}</Badge>
                  <span className="font-mono text-[11px] text-text-tertiary">
                    {timeAgo(note.updatedAt)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 pl-[22px] text-[12px] leading-[1.6] text-text-secondary">
                  {note.content}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {selectedNote && (
        <NoteReadingSheet
          note={selectedNote}
          open={!!selectedNote}
          onOpenChange={(open) => { if (!open) setSelectedNote(null); }}
        />
      )}
    </div>
  );
}
