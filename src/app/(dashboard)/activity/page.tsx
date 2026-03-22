import { fetchUserRepos, fetchActivityData } from "@/actions/github";
import { ActivityView } from "@/components/activity/activity-view";

export default async function ActivityPage() {
  const [repos, activity] = await Promise.all([
    fetchUserRepos(),
    fetchActivityData(),
  ]);

  return (
    <div className="mx-auto max-w-[1280px] space-y-6">
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Activity
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Your GitHub activity and repository overview.
        </p>
      </div>

      <ActivityView repos={repos} activity={activity} />
    </div>
  );
}
