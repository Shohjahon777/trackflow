import { NextResponse } from "next/server";
import { db } from "@/lib/db";


/**
 * Lightweight tracking endpoint for public profile views and project clicks.
 * Called from the public profile page via a 1×1 pixel or fetch.
 * POST /api/analytics { type: "profile_view" | "project_click", userId?, projectId?, referrer? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, userId, projectId, referrer } = body;

    if (type === "profile_view" && userId) {
      await db.profileView.create({
        data: {
          userId,
          referrer: referrer || null,
          path: body.path || null,
        },
      });
    } else if (type === "project_click" && projectId) {
      await db.projectClick.create({
        data: {
          projectId,
          referrer: referrer || null,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Silently succeed — analytics should never block
  }
}
