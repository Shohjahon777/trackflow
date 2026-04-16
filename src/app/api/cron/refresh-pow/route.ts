import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshProofOfWorkScore } from "@/lib/xp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.user.findMany({ select: { id: true } });
  let updated = 0;
  for (const u of users) {
    try {
      await refreshProofOfWorkScore(u.id);
      updated++;
    } catch {
      // Skip failures; next run will retry.
    }
  }

  return NextResponse.json({ ok: true, updated, total: users.length });
}
