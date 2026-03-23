import { NextRequest, NextResponse } from "next/server";
import { getBotById, logBotEvent, incrementErrorCount } from "@/lib/telegram/bot-registry";
import { createBotInstance } from "@/lib/telegram/bot-factory";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params;

  // 1. Load bot config from database
  const botConfig = await getBotById(botId);
  if (!botConfig || !botConfig.isEnabled) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  // 2. Validate webhook secret
  const secret = request.headers.get("x-telegram-bot-api-secret-token");
  if (secret !== botConfig.webhookSecret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // 3. Parse update and process
  try {
    const update = await request.json();
    const bot = createBotInstance(botConfig);
    await bot.handleUpdate(update);

    // 4. Log successful event
    await logBotEvent(botId, "message", { updateId: update.update_id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    // Log error but always return 200 to prevent Telegram retries
    await logBotEvent(
      botId,
      "error",
      { error: String(error) },
      "error"
    );
    await incrementErrorCount(botId);
    return NextResponse.json({ ok: true });
  }
}
