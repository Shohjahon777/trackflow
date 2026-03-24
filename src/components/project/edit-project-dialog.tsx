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
import { Pencil, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { updateProject, checkRepoUrl } from "@/actions/project";
import type { Project } from "@prisma/client";

type RepoStatus = {
  state: "idle" | "checking" | "valid" | "warning" | "error";
  message?: string;
  hint?: string;
};

export function EditProjectDialog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repoStatus, setRepoStatus] = useState<RepoStatus>({ state: "idle" });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleRepoBlur(e: React.FocusEvent<HTMLInputElement>) {
    const url = e.target.value.trim();
    if (!url) {
      setRepoStatus({ state: "idle" });
      return;
    }
    if (!url.includes("github.com/")) {
      setRepoStatus({
        state: "error",
        message: "Invalid GitHub URL",
        hint: "Use the format: https://github.com/owner/repo",
      });
      return;
    }

    setRepoStatus({ state: "checking" });
    const result = await checkRepoUrl(url);
    if (result.valid) {
      setRepoStatus({
        state: result.isPrivate ? "warning" : "valid",
        message: result.isPrivate
          ? `Private repo: ${result.fullName}`
          : `Connected: ${result.fullName}`,
        hint: result.isPrivate
          ? "Private repos work, but commits won't show if your token expires. Consider making it public."
          : undefined,
      });
    } else {
      setRepoStatus({
        state: "error",
        message: result.reason,
        hint: result.hint,
      });
    }
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateProject(project.id, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setRepoStatus({ state: "idle" }); }}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <Pencil size={14} />
            Edit
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              name="name"
              defaultValue={project.name}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input
              id="edit-slug"
              name="slug"
              defaultValue={project.slug}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              defaultValue={project.description ?? ""}
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-stack">Tech stack</Label>
            <Input
              id="edit-stack"
              name="stack"
              defaultValue={project.stack.join(", ")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-repoUrl">Repo URL</Label>
              <Input
                id="edit-repoUrl"
                name="repoUrl"
                defaultValue={project.repoUrl ?? ""}
                onBlur={handleRepoBlur}
                placeholder="https://github.com/owner/repo"
              />
              {repoStatus.state !== "idle" && (
                <div className="mt-1">
                  {repoStatus.state === "checking" && (
                    <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
                      <Loader2 size={12} className="animate-spin" />
                      Checking repository...
                    </div>
                  )}
                  {repoStatus.state === "valid" && (
                    <div className="flex items-center gap-1.5 text-[12px] text-[#3D8B6E]">
                      <CheckCircle2 size={12} strokeWidth={1.5} />
                      {repoStatus.message}
                    </div>
                  )}
                  {repoStatus.state === "warning" && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#C4956A]">
                        <AlertTriangle size={12} strokeWidth={1.5} />
                        {repoStatus.message}
                      </div>
                      {repoStatus.hint && (
                        <p className="pl-[18px] text-[11px] leading-[1.4] text-text-tertiary">
                          {repoStatus.hint}
                        </p>
                      )}
                    </div>
                  )}
                  {repoStatus.state === "error" && (
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[12px] text-[#C26A6A]">
                        <AlertTriangle size={12} strokeWidth={1.5} />
                        {repoStatus.message}
                      </div>
                      {repoStatus.hint && (
                        <p className="pl-[18px] text-[11px] leading-[1.4] text-text-tertiary">
                          {repoStatus.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-deployUrl">Deploy URL</Label>
              <Input
                id="edit-deployUrl"
                name="deployUrl"
                defaultValue={project.deployUrl ?? ""}
                placeholder="https://myapp.vercel.app"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-category">Category</Label>
              <select
                id="edit-category"
                name="category"
                defaultValue={project.category}
                className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
              >
                <option value="PERSONAL">Personal</option>
                <option value="CLIENT">Client</option>
                <option value="OPEN_SOURCE">Open source</option>
                <option value="EXPERIMENT">Experiment</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-status">Status</Label>
              <select
                id="edit-status"
                name="status"
                defaultValue={project.status}
                className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
              >
                <option value="ACTIVE">Active</option>
                <option value="DEPLOYED">Deployed</option>
                <option value="STALE">Stale</option>
                <option value="PAUSED">Paused</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
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
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
