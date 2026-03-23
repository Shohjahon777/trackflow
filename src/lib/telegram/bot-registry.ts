import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import type { TelegramBotConfig } from "@/types/telegram";


export async function getBotById(
  botId: string
): Promise<TelegramBotConfig | null> {
  const bot = await db.telegramBot.findUnique({
    where: { id: botId },
  });

  if (!bot) return null;

  return {
    ...bot,
    token: decrypt(bot.token),
  };
}

export async function getAllBots(userId: string) {
  return db.telegramBot.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      botUsername: true,
      handlerType: true,
      isEnabled: true,
      lastPingAt: true,
      errorCount: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function logBotEvent(
  botId: string,
  event: string,
  payload?: Record<string, unknown>,
  level: "info" | "warn" | "error" = "info"
) {
  await db.telegramBotLog.create({
    data: {
      botId,
      event,
      payload: (payload ?? undefined) as Record<string, string> | undefined,
      level,
    },
  });

  // Update lastPingAt on non-error events
  if (level !== "error") {
    await db.telegramBot.update({
      where: { id: botId },
      data: { lastPingAt: new Date(), errorCount: 0 },
    });
  }
}

export async function incrementErrorCount(botId: string) {
  const bot = await db.telegramBot.update({
    where: { id: botId },
    data: { errorCount: { increment: 1 } },
  });

  // Circuit breaker: disable after 50 consecutive errors
  if (bot.errorCount >= 50) {
    await db.telegramBot.update({
      where: { id: botId },
      data: { isEnabled: false },
    });
    await logBotEvent(botId, "circuit_breaker", {
      message: "Bot disabled after 50 consecutive errors",
    }, "error");
  }
}

export async function getBotLogs(
  botId: string,
  options: { level?: string; limit?: number; offset?: number } = {}
) {
  const { level, limit = 50, offset = 0 } = options;

  return db.telegramBotLog.findMany({
    where: {
      botId,
      ...(level ? { level } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}
