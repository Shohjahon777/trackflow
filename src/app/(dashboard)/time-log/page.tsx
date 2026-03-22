import { Clock } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function TimeLogPage() {
  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Time log
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Track time and costs across your projects.
        </p>
      </div>

      <EmptyState
        icon={Clock}
        title="Coming soon"
        description="Manual time and cost logging will be available in a future update."
      />
    </div>
  );
}
