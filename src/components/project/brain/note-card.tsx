"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { deleteNote } from "@/actions/note";
import { EditNoteDialog } from "./edit-note-dialog";
import { NoteReadingSheet } from "./note-reading-sheet";

type NoteCardProps = {
  note: {
    id: string;
    title: string;
    content: string;
    type: string;
    updatedAt: Date;
  };
};

export function NoteCard({ note }: NoteCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [readOpen, setReadOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Delete this note?")) return;
    setMenuOpen(false);
    startTransition(async () => {
      await deleteNote(note.id);
      router.refresh();
    });
  }

  return (
    <>
      <div
        className="group relative flex cursor-pointer flex-col gap-2 rounded-md border-[0.5px] border-border bg-background p-4 transition-colors duration-[120ms] hover:border-accent-muted"
        onClick={() => setReadOpen(true)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex size-[28px] shrink-0 items-center justify-center rounded-md bg-fog dark:bg-surface-hover">
              <FileText size={14} className="text-slate" strokeWidth={1.5} />
            </div>
            <h3 className="truncate text-[14px] font-medium text-text-primary">
              {note.title}
            </h3>
          </div>

          {/* More menu */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="flex size-[28px] items-center justify-center rounded-md text-ash opacity-0 transition-colors duration-[120ms] group-hover:opacity-100 hover:bg-surface-hover hover:text-text-secondary"
            >
              <MoreHorizontal size={14} strokeWidth={1.5} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                <div className="absolute right-0 top-[32px] z-20 w-[140px] rounded-md border-[0.5px] border-border bg-background p-1 shadow-sm">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setEditOpen(true); }}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                  >
                    <Pencil size={13} strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(); }}
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

        <p className="line-clamp-3 text-[13px] leading-[1.6] text-text-secondary">
          {note.content}
        </p>

        <div className="flex items-center justify-end">
          <span className="font-mono text-[11px] text-text-tertiary">
            {note.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>

      <EditNoteDialog
        note={{ id: note.id, title: note.title, content: note.content, type: note.type }}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <NoteReadingSheet
        note={note}
        open={readOpen}
        onOpenChange={setReadOpen}
        onEdit={() => { setReadOpen(false); setEditOpen(true); }}
      />
    </>
  );
}
