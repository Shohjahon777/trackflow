"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createNote } from "@/actions/note";

type Project = { id: string; name: string };

export function CreateNoteDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createNote(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus size={16} />
            New note
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create note</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              name="title"
              placeholder="Note title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-type">Type</Label>
              <select
                id="note-type"
                name="type"
                defaultValue="GENERAL"
                className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
              >
                <option value="GENERAL">General note</option>
                <option value="PROMPT">Prompt</option>
                <option value="ADR">Architecture decision</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note-project">Project</Label>
              <select
                id="note-project"
                name="projectId"
                required
                className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
              >
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              name="content"
              placeholder="Write your note content here..."
              rows={8}
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
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
