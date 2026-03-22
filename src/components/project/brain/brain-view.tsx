"use client";

import { useState } from "react";
import { Search, Brain as BrainIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteTypeTabs } from "@/components/project/brain/note-type-tabs";
import { PromptCard } from "@/components/project/brain/prompt-card";
import { AdrCard } from "@/components/project/brain/adr-card";
import { NoteCard } from "@/components/project/brain/note-card";
import type { Note, NoteType } from "@prisma/client";

type NoteWithProject = Note & { project: { id: string; name: string } };

export function BrainView({ notes }: { notes: NoteWithProject[] }) {
  const [activeType, setActiveType] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = notes.filter((n) => {
    if (activeType !== "ALL" && n.type !== activeType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const prompts = filtered.filter((n) => n.type === "PROMPT");
  const adrs = filtered.filter((n) => n.type === "ADR");
  const generals = filtered.filter((n) => n.type === "GENERAL");

  const counts: Record<string, number> = {
    ALL: notes.length,
    PROMPT: notes.filter((n) => n.type === "PROMPT").length,
    ADR: notes.filter((n) => n.type === "ADR").length,
    GENERAL: notes.filter((n) => n.type === "GENERAL").length,
  };

  const showPrompts = activeType === "ALL" || activeType === "PROMPT";
  const showAdrs = activeType === "ALL" || activeType === "ADR";
  const showNotes = activeType === "ALL" || activeType === "GENERAL";

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={BrainIcon}
        title="No notes yet"
        description="Create your first note to start building your project brain."
      />
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-3">
        <NoteTypeTabs active={activeType} onChange={setActiveType} counts={counts} />
        <div className="relative ml-auto w-[240px]">
          <Search
            size={14}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ash"
          />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Prompts */}
      {showPrompts && prompts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Prompts
            </h2>
            <span className="font-mono text-[11px] text-text-tertiary">
              {prompts.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
            {prompts.map((note) => (
              <PromptCard
                key={note.id}
                prompt={{
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  tags: [],
                  usageCount: 0,
                  updatedAt: note.updatedAt,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ADRs */}
      {showAdrs && adrs.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Architecture decisions
            </h2>
            <span className="font-mono text-[11px] text-text-tertiary">
              {adrs.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
            {adrs.map((note) => (
              <AdrCard
                key={note.id}
                adr={{
                  id: note.id,
                  title: note.title,
                  status: "accepted",
                  context: note.content.split("\n")[0] || note.content,
                  decision: note.content.split("\n").slice(1).join("\n") || note.content,
                  updatedAt: note.updatedAt,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* General notes */}
      {showNotes && generals.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
              Notes
            </h2>
            <span className="font-mono text-[11px] text-text-tertiary">
              {generals.length}
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-3">
            {generals.map((note) => (
              <NoteCard
                key={note.id}
                note={{
                  id: note.id,
                  title: note.title,
                  content: note.content,
                  updatedAt: note.updatedAt,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-[14px] text-text-secondary py-8">
          No notes match your search.
        </p>
      )}
    </>
  );
}
