import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Verify signature
  const signature = request.headers.get("x-hub-signature-256");
  const body = await request.text();

  const expectedSignature =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (!signature || !crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  const payload = JSON.parse(body);

  if (event === "push") {
    const repoUrl = payload.repository?.html_url;
    if (repoUrl) {
      // Update the updatedAt timestamp for matching projects
      await db.project.updateMany({
        where: { repoUrl },
        data: { updatedAt: new Date() },
      });

      // If project was stale, mark it active again
      await db.project.updateMany({
        where: { repoUrl, status: "STALE" },
        data: { status: "ACTIVE" },
      });

      revalidatePath("/projects");
    }
  }

  return NextResponse.json({ received: true });
}
