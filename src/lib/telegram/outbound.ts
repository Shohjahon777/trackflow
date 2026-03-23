import { Bot } from "grammy";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

// TODO: Remove after `prisma generate`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = db as any;

/**
 * Send a notification message to a specific Telegram chat.
 */
export async function sendNotification(
  botId: string,
  chatId: string,
  message: string,
  options?: { parseMode?: "HTML" | "Markdown" }
) {
  const botConfig = await prisma.telegramBot.findUnique({
    where: { id: botId },
  });
  if (!botConfig || !botConfig.isEnabled) return;

  const bot = new Bot(decrypt(botConfig.token));
  await bot.api.sendMessage(chatId, message, {
    parse_mode: options?.parseMode ?? "HTML",
  });
}

/**
 * Send a notification to all chats linked to a user.
 */
export async function notifyUser(
  userId: string,
  message: string,
  options?: { parseMode?: "HTML" | "Markdown" }
) {
  const chats = await prisma.telegramChat.findMany({
    where: { userId },
  });

  for (const chat of chats) {
    try {
      await sendNotification(chat.botId, chat.chatId, message, options);
    } catch {
      // Silently fail — don't block on notification failures
    }
  }
}

/**
 * Notify about project status changes.
 */
export async function notifyProjectStatusChange(
  userId: string,
  projectName: string,
  newStatus: string
) {
  await notifyUser(
    userId,
    `<b>${projectName}</b> status changed to <code>${newStatus}</code>`
  );
}

/**
 * Notify about milestone completion.
 */
export async function notifyMilestoneComplete(
  userId: string,
  projectName: string,
  milestoneTitle: string
) {
  await notifyUser(
    userId,
    `✓ Milestone completed in <b>${projectName}</b>: ${milestoneTitle}`
  );
}
