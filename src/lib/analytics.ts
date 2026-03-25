import { db } from "@/lib/db";


export type AnalyticsData = {
  totalViews: number;
  totalClicks: number;
  viewsByDay: { date: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  topProjects: { id: string; name: string; clicks: number }[];
  topCountries: { country: string; count: number }[];
};

export async function getAnalytics(
  userId: string,
  days: number = 30
): Promise<AnalyticsData> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalViews, totalClicks, views, clicks, projects] = await Promise.all([
    // Total profile views
    db.profileView.count({
      where: { userId, timestamp: { gte: since } },
    }),

    // Total project clicks
    db.projectClick.count({
      where: { project: { userId }, timestamp: { gte: since } },
    }),

    // Views by day + country
    db.profileView.findMany({
      where: { userId, timestamp: { gte: since } },
      select: { timestamp: true, country: true },
      orderBy: { timestamp: "asc" },
    }),

    // All clicks with referrers
    db.projectClick.findMany({
      where: { project: { userId }, timestamp: { gte: since } },
      select: { referrer: true, projectId: true },
    }),

    // Projects for click mapping
    db.project.findMany({
      where: { userId },
      select: { id: true, name: true },
    }),
  ]);

  // Aggregate views by day
  const viewMap = new Map<string, number>();
  for (const v of views) {
    const day = v.timestamp.toISOString().split("T")[0];
    viewMap.set(day, (viewMap.get(day) || 0) + 1);
  }
  const viewsByDay = Array.from(viewMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Top referrers
  const refMap = new Map<string, number>();
  for (const c of clicks) {
    const ref = c.referrer || "Direct";
    refMap.set(ref, (refMap.get(ref) || 0) + 1);
  }
  const topReferrers = Array.from(refMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Top projects by clicks
  const clickMap = new Map<string, number>();
  for (const c of clicks) {
    clickMap.set(c.projectId, (clickMap.get(c.projectId) || 0) + 1);
  }
  const projectMap = new Map(projects.map((p: { id: string; name: string }) => [p.id, p.name]));
  const topProjects = Array.from(clickMap.entries())
    .map(([id, clickCount]) => ({
      id,
      name: (projectMap.get(id) as string) || "Unknown",
      clicks: clickCount,
    }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);

  // Top countries
  const countryMap = new Map<string, number>();
  for (const v of views) {
    const c = v.country || "Unknown";
    countryMap.set(c, (countryMap.get(c) || 0) + 1);
  }
  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { totalViews, totalClicks, viewsByDay, topReferrers, topProjects, topCountries };
}
