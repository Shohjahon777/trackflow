import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getAnalytics } from "@/lib/analytics";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const analytics = await getAnalytics(userId, 30);

  return <AnalyticsDashboard data={analytics} />;
}
