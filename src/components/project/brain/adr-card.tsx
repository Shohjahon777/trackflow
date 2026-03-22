import { GitPullRequest } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AdrStatus = "proposed" | "accepted" | "deprecated";

type AdrCardProps = {
  adr: {
    id: string;
    title: string;
    status: AdrStatus;
    context: string;
    decision: string;
    updatedAt: Date;
  };
};

const statusVariant: Record<AdrStatus, "info" | "success" | "neutral"> = {
  proposed: "info",
  accepted: "success",
  deprecated: "neutral",
};

export function AdrCard({ adr }: AdrCardProps) {
  return (
    <div className="group flex flex-col gap-3 rounded-md border-[0.5px] border-border bg-background p-4 transition-colors duration-[120ms] hover:border-accent-muted">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-[28px] shrink-0 items-center justify-center rounded-md bg-info-bg">
            <GitPullRequest size={14} className="text-info" strokeWidth={1.5} />
          </div>
          <h3 className="truncate text-[14px] font-medium text-text-primary">
            {adr.title}
          </h3>
        </div>
        <Badge variant={statusVariant[adr.status]}>{adr.status}</Badge>
      </div>

      {/* Context */}
      <div className="space-y-2">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Context
          </span>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-[1.5] text-text-secondary">
            {adr.context}
          </p>
        </div>
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Decision
          </span>
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-[1.5] text-text-body">
            {adr.decision}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end">
        <span className="font-mono text-[11px] text-text-tertiary">
          {adr.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
