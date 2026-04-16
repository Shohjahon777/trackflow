import { db } from "@/lib/db";
import type { XpAction, Prisma } from "@prisma/client";

export const XP_VALUES: Record<XpAction, number> = {
  DEPLOY: 50,
  MILESTONE: 30,
  BRAIN_NOTE: 10,
  PROJECT_SHIPPED: 100,
  STREAK_DAY: 5,
  STAR_RECEIVED: 2,
  CHALLENGE_COMPLETED: 25,
  VOUCH_SPENT: -50,
  VOUCH_REFUND: 25,
  HIDE_SPENT: -100,
};

export type LeagueSlug =
  | "bronze"
  | "silver"
  | "gold"
  | "crystal"
  | "master"
  | "champion"
  | "titan"
  | "legend";

export type League = {
  id: number;        // 1–8
  name: string;      // "Bronze"
  slug: LeagueSlug;  // "bronze"
};

export const LEAGUES: readonly League[] = [
  { id: 1, name: "Bronze", slug: "bronze" },
  { id: 2, name: "Silver", slug: "silver" },
  { id: 3, name: "Gold", slug: "gold" },
  { id: 4, name: "Crystal", slug: "crystal" },
  { id: 5, name: "Master", slug: "master" },
  { id: 6, name: "Champion", slug: "champion" },
  { id: 7, name: "Titan", slug: "titan" },
  { id: 8, name: "Legend", slug: "legend" },
];

// 24 rank thresholds — 8 leagues × 3 tiers. Tier 3 = III (lowest), 1 = I (highest).
// Smooth ~1.25× progression keeps next rank always within striking distance.
const RANK_THRESHOLDS: readonly number[] = [
  0,       // 1  Bronze III
  100,     // 2  Bronze II
  250,     // 3  Bronze I
  500,     // 4  Silver III
  900,     // 5  Silver II
  1_500,   // 6  Silver I
  2_400,   // 7  Gold III
  3_600,   // 8  Gold II
  5_200,   // 9  Gold I
  7_200,   // 10 Crystal III
  9_800,   // 11 Crystal II
  13_000,  // 12 Crystal I
  17_000,  // 13 Master III
  21_500,  // 14 Master II
  27_000,  // 15 Master I
  34_000,  // 16 Champion III
  42_500,  // 17 Champion II
  52_000,  // 18 Champion I
  63_000,  // 19 Titan III
  76_000,  // 20 Titan II
  90_000,  // 21 Titan I
  107_000, // 22 Legend III
  126_000, // 23 Legend II
  150_000, // 24 Legend I
];

const TIER_LABELS: Record<1 | 2 | 3, "I" | "II" | "III"> = {
  3: "III",
  2: "II",
  1: "I",
};

const STAR_DAILY_CAP = 20;

const STREAK_MILESTONES: Record<number, { name: string; bonus: number }> = {
  7: { name: "7-day streak", bonus: 20 },
  14: { name: "2-week streak", bonus: 50 },
  30: { name: "30-day streak", bonus: 100 },
  60: { name: "60-day streak", bonus: 250 },
  100: { name: "100-day streak", bonus: 500 },
};

export type LeagueInfo = {
  rank: number;              // 1–24
  level: number;              // alias of rank (stored on user.level)
  league: League;
  tier: 1 | 2 | 3;            // 3 = III (lowest), 1 = I (highest)
  tierLabel: "I" | "II" | "III";
  fullName: string;           // "Bronze III" (Legend tier 1 → "Legend")
  currentMin: number;
  nextMin: number | null;
  nextFullName: string | null;
  progress: number;           // 0–1 toward next rank
};

function rankInfo(rank: number): { league: League; tier: 1 | 2 | 3; fullName: string } {
  const leagueIndex = Math.floor((rank - 1) / 3);           // 0–7
  const tier = (3 - ((rank - 1) % 3)) as 1 | 2 | 3;         // rank 1 → tier 3, rank 3 → tier 1
  const league = LEAGUES[leagueIndex];
  const label = TIER_LABELS[tier];
  // Legend I (top rank) drops the numeral — matches CoC's capped "Legend" feel.
  const fullName = rank === RANK_THRESHOLDS.length ? league.name : `${league.name} ${label}`;
  return { league, tier, fullName };
}

export function levelFromXp(xp: number): LeagueInfo {
  let rank = 1;
  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (xp >= RANK_THRESHOLDS[i]) rank = i + 1;
  }
  const info = rankInfo(rank);
  const currentMin = RANK_THRESHOLDS[rank - 1];
  const nextMin = rank < RANK_THRESHOLDS.length ? RANK_THRESHOLDS[rank] : null;
  const nextFullName = nextMin !== null ? rankInfo(rank + 1).fullName : null;
  return {
    rank,
    level: rank,
    league: info.league,
    tier: info.tier,
    tierLabel: TIER_LABELS[info.tier],
    fullName: info.fullName,
    currentMin,
    nextMin,
    nextFullName,
    progress: nextMin !== null ? (xp - currentMin) / (nextMin - currentMin) : 1,
  };
}

type AwardInput = {
  userId: string;
  action: XpAction;
  projectId?: string;
  points?: number;
  metadata?: Prisma.InputJsonValue;
};

export async function awardXp({ userId, action, projectId, points, metadata }: AwardInput) {
  const value = points ?? XP_VALUES[action];
  if (value === 0) return { awarded: 0 };

  if (action === "STAR_RECEIVED") {
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    const earnedToday = await db.xpEvent.aggregate({
      where: { userId, actionType: "STAR_RECEIVED", createdAt: { gte: since } },
      _sum: { points: true },
    });
    const remaining = STAR_DAILY_CAP - (earnedToday._sum.points ?? 0);
    if (remaining <= 0) return { awarded: 0, capped: true };
    if (value > remaining) {
      return persist(userId, action, remaining, projectId, metadata);
    }
  }

  return persist(userId, action, value, projectId, metadata);
}

async function persist(
  userId: string,
  action: XpAction,
  points: number,
  projectId?: string,
  metadata?: Prisma.InputJsonValue,
) {
  const result = await db.$transaction(async (tx) => {
    await tx.xpEvent.create({
      data: { userId, actionType: action, points, projectId, metadata },
    });
    const user = await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: points } },
      select: { xp: true, level: true },
    });
    const newLevel = levelFromXp(user.xp).level;
    if (newLevel !== user.level) {
      await tx.user.update({ where: { id: userId }, data: { level: newLevel } });
    }
    return { xp: user.xp, level: newLevel, leveledUp: newLevel > user.level };
  });
  return { awarded: points, ...result };
}

export async function spendXp(input: AwardInput & { points: number }) {
  const user = await db.user.findUnique({ where: { id: input.userId }, select: { xp: true } });
  if (!user || user.xp < input.points) {
    return { ok: false as const, reason: "insufficient_xp" as const };
  }
  const res = await persist(input.userId, input.action, -input.points, input.projectId, input.metadata);
  return { ok: true as const, ...res };
}

// Proof-of-work score (0–100). Recomputed nightly via cron.
// Weighted so no single dimension can saturate the score.
export async function computeProofOfWorkScore(userId: string): Promise<number> {
  const [user, projects, notesCount, deployEvents] = await Promise.all([
    db.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, longestStreak: true, currentStreak: true },
    }),
    db.project.findMany({
      where: { userId },
      select: { status: true, stack: true, deployUrl: true },
    }),
    db.note.count({ where: { project: { userId } } }),
    db.xpEvent.count({
      where: {
        userId,
        actionType: "DEPLOY",
        createdAt: { gte: new Date(Date.now() - 30 * 864e5) },
      },
    }),
  ]);
  if (!user) return 0;

  const shipped = projects.filter((p) => p.status === "DEPLOYED" || p.deployUrl).length;
  const stacks = new Set(projects.flatMap((p) => p.stack));
  const ageDays = (Date.now() - user.createdAt.getTime()) / 864e5;

  // Each sub-score saturates at its own ceiling, then weighted-summed to 100.
  const shippedScore = Math.min(shipped / 10, 1) * 30;           // 30 pts
  const streakScore = Math.min(user.longestStreak / 60, 1) * 20; // 20 pts
  const stackScore = Math.min(stacks.size / 6, 1) * 10;          // 10 pts
  const notesScore = Math.min(notesCount / 40, 1) * 15;          // 15 pts
  const deployScore = Math.min(deployEvents / 12, 1) * 20;       // 20 pts (30d deploy freq)
  const ageScore = Math.min(ageDays / 180, 1) * 5;               //  5 pts

  return Math.round(
    shippedScore + streakScore + stackScore + notesScore + deployScore + ageScore,
  );
}

export async function refreshProofOfWorkScore(userId: string) {
  const score = await computeProofOfWorkScore(userId);
  await db.user.update({ where: { id: userId }, data: { proofOfWorkScore: score } });
  return score;
}

// Streak update — call on any qualifying activity (commit, deploy, milestone, brain note).
// Returns true if this call actually extended the streak (i.e. first activity today).
export async function tickStreak(userId: string): Promise<{ extended: boolean; streak: number }> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { currentStreak: true, longestStreak: true, lastActivityDate: true },
  });
  if (!user) return { extended: false, streak: 0 };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  if (last && last.getTime() === today.getTime()) {
    return { extended: false, streak: user.currentStreak };
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const continues = last && last.getTime() === yesterday.getTime();
  const newStreak = continues ? user.currentStreak + 1 : 1;

  await db.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      lastActivityDate: today,
    },
  });

  await awardXp({ userId, action: "STREAK_DAY" });

  const milestone = STREAK_MILESTONES[newStreak];
  if (milestone) {
    const existing = await db.badge.findFirst({
      where: { userId, type: "STREAK", name: milestone.name },
      select: { id: true },
    });
    if (!existing) {
      await db.badge.create({
        data: { userId, type: "STREAK", name: milestone.name, metadata: { days: newStreak } },
      });
      await awardXp({
        userId,
        action: "CHALLENGE_COMPLETED",
        points: milestone.bonus,
        metadata: { streakMilestone: newStreak },
      });
    }
  }

  return { extended: true, streak: newStreak };
}
