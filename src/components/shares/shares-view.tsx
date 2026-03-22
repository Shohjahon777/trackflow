"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Link2Off, Link2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateShareToken, revokeShareToken } from "@/actions/share";
import type { ProjectStatus } from "@prisma/client";

const statusVariant: Record<ProjectStatus, "success" | "info" | "warning" | "neutral"> = {
  DEPLOYED: "success",
  ACTIVE: "info",
  STALE: "warning",
  ARCHIVED: "neutral",
  PAUSED: "neutral",
};

type SharedProject = {
  id: string;
  name: string;
  slug: string;
  status: ProjectStatus;
  shareToken: string | null;
  updatedAt: Date;
};

type SimpleProject = {
  id: string;
  name: string;
  hasShareToken: boolean;
};

export function SharesView({
  sharedProjects,
  allProjects,
}: {
  sharedProjects: SharedProject[];
  allProjects: SimpleProject[];
}) {
  const unsharedProjects = allProjects.filter((p) => !p.hasShareToken);

  return (
    <div className="space-y-8">
      {/* Active shares */}
      {sharedProjects.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Active share links
          </h2>
          <div className="mt-3 space-y-2">
            {sharedProjects.map((project) => (
              <ShareRow key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Projects without shares */}
      {unsharedProjects.length > 0 && (
        <section>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Generate new share link
          </h2>
          <div className="mt-3 space-y-2">
            {unsharedProjects.map((project) => (
              <GenerateRow key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ShareRow({ project }: { project: SharedProject }) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${project.shareToken}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRevoke() {
    startTransition(async () => {
      await revokeShareToken(project.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-4 rounded-md border-[0.5px] border-border bg-surface p-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-text-primary">
            {project.name}
          </span>
          <Badge variant={statusVariant[project.status]}>
            {project.status.toLowerCase()}
          </Badge>
        </div>
        <p className="mt-0.5 truncate font-mono text-[12px] text-text-tertiary">
          {shareUrl}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon-sm">
            <ExternalLink size={14} />
          </Button>
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRevoke}
          disabled={isPending}
          className="text-danger hover:text-danger"
        >
          <Link2Off size={14} />
          Revoke
        </Button>
      </div>
    </div>
  );
}

function GenerateRow({ project }: { project: SimpleProject }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleGenerate() {
    startTransition(async () => {
      await generateShareToken(project.id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-between rounded-md border-[0.5px] border-border p-3">
      <span className="text-[14px] text-text-primary">{project.name}</span>
      <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={isPending}>
        <Link2 size={14} />
        {isPending ? "Generating..." : "Generate link"}
      </Button>
    </div>
  );
}
