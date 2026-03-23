"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateNote } from "@/actions/note";

type EditNoteDialogProps = {
  note: {
    id: string;
    title: string;
    content: string;
    type: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditNoteDialog({ note, open, onOpenChange }: EditNoteDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateNote(note.id, formData);
      if (result.error) {
        setError(result.error);
      } else {
        onOpenChange(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit note</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-note-title">Title</Label>
            <Input
              id="edit-note-title"
              name="title"
              defaultValue={note.title}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-note-type">Type</Label>
            <select
              id="edit-note-type"
              name="type"
              defaultValue={note.type}
              className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
            >
              <option value="GENERAL">General note</option>
              <option value="PROMPT">Prompt</option>
              <option value="ADR">Architecture decision</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-note-content">Content</Label>
            <Textarea
              id="edit-note-content"
              name="content"
              defaultValue={note.content}
              rows={12}
              className="font-mono text-[13px]"
              required
            />
          </div>

          {error && (
            <p className="text-[13px] text-danger">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
