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
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/actions/project";

export function DeleteProjectButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const canDelete = confirmation === projectName;

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.push("/projects");
        router.refresh();
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); setConfirmation(""); }}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <Trash2 size={14} />
            Delete
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <p className="text-[14px] text-text-secondary">
            This will permanently delete <span className="font-medium text-text-primary">{projectName}</span> and
            all its notes. This action cannot be undone.
          </p>

          <div className="flex flex-col gap-1.5">
            <p className="text-[13px] text-text-secondary">
              Type <span className="font-mono font-medium text-text-primary">{projectName}</span> to confirm:
            </p>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={projectName}
            />
          </div>

          {error && (
            <p className="text-[13px] text-danger">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!canDelete || isPending}
              onClick={handleDelete}
            >
              {isPending ? "Deleting..." : "Delete project"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
