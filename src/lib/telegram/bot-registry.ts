import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import type { TelegramBotConfig } from "@/types/telegram";

// TODO: Remove `as any` after `prisma generate`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = db as any;

export async function getBotById(
  botId: string
): Promise<TelegramBotConfig | null> {
  const bot = await prisma.telegramBot.findUnique({
    where: { id: botId },
  });

  if (!bot) return null;

  return {
    ...bot,
    token: decrypt(bot.token),
  };
}

export async function getAllBots(userId: string) {
  return prisma.telegramBot.findMany({
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
  await prisma.telegramBotLog.create({
    data: {
      botId,
      event,
      payload: payload ?? undefined,
      level,
    },
  });

  // Update lastPingAt on non-error events
  if (level !== "error") {
    await prisma.telegramBot.update({
      where: { id: botId },
      data: { lastPingAt: new Date(), errorCount: 0 },
    });
  }
}

export async function incrementErrorCount(botId: string) {
  const bot = await prisma.telegramBot.update({
    where: { id: botId },
    data: { errorCount: { increment: 1 } },
  });

  // Circuit breaker: disable after 50 consecutive errors
  if (bot.errorCount >= 50) {
    await prisma.telegramBot.update({
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

  return prisma.telegramBotLog.findMany({
    where: {
      botId,
      ...(level ? { level } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}
