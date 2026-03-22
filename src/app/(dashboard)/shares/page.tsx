import { Share2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getSharedProjects } from "@/actions/share";
import { getProjects } from "@/actions/project";
import { SharesView } from "@/components/shares/shares-view";

export default async function SharesPage() {
  const [sharedProjects, allProjects] = await Promise.all([
    getSharedProjects(),
    getProjects(),
  ]);

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Shares
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Manage client share links for your projects.
        </p>
      </div>

      {allProjects.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No projects to share"
          description="Create a project first, then you can generate share links."
        />
      ) : (
        <SharesView
          sharedProjects={sharedProjects}
          allProjects={allProjects.map((p) => ({
            id: p.id,
            name: p.name,
            hasShareToken: !!p.shareToken,
          }))}
        />
      )}
    </div>
  );
}
