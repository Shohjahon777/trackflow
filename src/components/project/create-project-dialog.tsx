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
import { createProject } from "@/actions/project";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManual, setSlugManual] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleNameChange(value: string) {
    setName(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setSlug(value);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createProject(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setName("");
        setSlug("");
        setSlugManual(false);
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
            New project
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="My awesome project"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              placeholder="my-awesome-project"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
            />
            <p className="text-[11px] text-text-tertiary">
              Used in URLs. Lowercase letters, numbers, and hyphens only.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What is this project about?"
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stack">Tech stack</Label>
            <Input
              id="stack"
              name="stack"
              placeholder="Next.js, TypeScript, Prisma"
            />
            <p className="text-[11px] text-text-tertiary">
              Comma-separated list of technologies.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="repoUrl">Repo URL</Label>
              <Input
                id="repoUrl"
                name="repoUrl"
                placeholder="https://github.com/..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deployUrl">Deploy URL</Label>
              <Input
                id="deployUrl"
                name="deployUrl"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              defaultValue="PERSONAL"
              className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
            >
              <option value="PERSONAL">Personal</option>
              <option value="CLIENT">Client</option>
              <option value="OPEN_SOURCE">Open source</option>
              <option value="EXPERIMENT">Experiment</option>
            </select>
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
              {isPending ? "Creating..." : "Create project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
