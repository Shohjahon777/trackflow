import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = { title: "Activity" };

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      <div className="mb-8">
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Activity
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          A unified feed of everything happening across your projects.
        </p>
      </div>

      <ComingSoon
        feature="Activity feed"
        description="A real-time timeline of commits, task completions, deploys, and time logs — all your project activity in one place."
        items={[
          { label: "Internal activity tracking (tasks, logs, notes)", done: true },
          { label: "GitHub commit feed per project", done: true },
          { label: "Unified cross-project timeline", done: false },
          { label: "Filter by project, type, or date range", done: false },
          { label: "Activity digest export", done: false },
        ]}
      />
    </div>
  );
}
