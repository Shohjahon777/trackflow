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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createTimeLog } from "@/actions/time-log";

type Project = {
  id: string;
  name: string;
};

export function LogTimeDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Default date to today in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTimeLog(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setOpen(false);
        setError(null);
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
            Log time
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log time</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="projectId">Project</Label>
            <select
              id="projectId"
              name="projectId"
              required
              className="h-[36px] w-full rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body outline-none focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border"
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="What did you work on?"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Duration</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  id="hours"
                  name="hours"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={0}
                  className="pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.04em] text-text-tertiary">
                  hrs
                </span>
              </div>
              <div className="relative">
                <Input
                  id="minutes"
                  name="minutes"
                  type="number"
                  min={0}
                  max={59}
                  defaultValue={0}
                  className="pr-10"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] uppercase tracking-[0.04em] text-text-tertiary">
                  min
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cost">
              Cost{" "}
              <span className="text-[11px] font-normal text-text-tertiary">
                (optional)
              </span>
            </Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-text-tertiary">
                $
              </span>
              <Input
                id="cost"
                name="cost"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              required
            />
          </div>

          {error && <p className="text-[13px] text-danger">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Log time"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
