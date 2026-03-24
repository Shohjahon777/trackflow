import type { Metadata } from "next";
import { Clock } from "lucide-react";

export const metadata: Metadata = { title: "Time log" };
import { EmptyState } from "@/components/ui/empty-state";
import { TimeLogView } from "@/components/time-log/time-log-view";
import { LogTimeDialog } from "@/components/time-log/log-time-dialog";
import { getTimeLogs, getTimeLogStats } from "@/actions/time-log";
import { getProjects } from "@/actions/project";

export default async function TimeLogPage() {
  const [logs, stats, projects] = await Promise.all([
    getTimeLogs(),
    getTimeLogStats(),
    getProjects(),
  ]);

  const hasProjects = projects.length > 0;

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
            Time log
          </h1>
          <p className="mt-1 text-[14px] text-text-secondary">
            Know exactly where your hours go — per project, per task.
          </p>
        </div>
        {hasProjects && (
          <LogTimeDialog
            projects={projects.map((p) => ({ id: p.id, name: p.name }))}
          />
        )}
      </div>

      {!hasProjects ? (
        <EmptyState
          icon={Clock}
          title="No projects yet"
          description="Create a project first, then you can start logging time against it."
        />
      ) : (
        <TimeLogView
          logs={JSON.parse(JSON.stringify(logs))}
          stats={stats}
        />
      )}
    </div>
  );
}
