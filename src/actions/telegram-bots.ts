"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkPlan } from "@/lib/plan";
import { encrypt, generateWebhookSecret } from "@/lib/encryption";
import {
  registerWebhook,
  removeWebhook,
  validateBotToken,
} from "@/lib/telegram/webhook";
import { clearBotCache } from "@/lib/telegram/bot-factory";
import { logBotEvent, getBotLogs } from "@/lib/telegram/bot-registry";
import { z } from "zod";


const createBotSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  token: z.string().min(1, "Bot token is required"),
  handlerType: z.enum(["notification", "project-updates", "client-comms"]),
  config: z.record(z.string(), z.unknown()).optional(),
});

export async function createTelegramBot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  // Pro plan required
  const plan = await checkPlan(session.user.id);
  if (!plan.isPro) {
    return { error: "Pro plan required for bot assistants" };
  }

  const raw = {
    name: formData.get("name") as string,
    token: formData.get("token") as string,
    handlerType: formData.get("handlerType") as string,
    config: {},
  };

  const parsed = createBotSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Validate bot token with Telegram
  const botInfo = await validateBotToken(parsed.data.token);
  if (!botInfo) {
    return { error: "Invalid bot token. Please check with @BotFather." };
  }

  // Check if bot username is already registered
  const existing = await db.telegramBot.findUnique({
    where: { botUsername: botInfo.username },
  });
  if (existing) {
    return { error: `Bot @${botInfo.username} is already registered.` };
  }

  // Generate webhook secret and encrypt token
  const webhookSecret = generateWebhookSecret();
  const encryptedToken = encrypt(parsed.data.token);

  // Create bot record
  const bot = await db.telegramBot.create({
    data: {
      name: parsed.data.name,
      botUsername: botInfo.username,
      token: encryptedToken,
      webhookSecret,
      handlerType: parsed.data.handlerType,
      config: (parsed.data.config ?? {}) as Record<string, string>,
      userId: session.user.id,
    },
  });

  // Register webhook with Telegram
  try {
    await registerWebhook(bot.id, parsed.data.token, webhookSecret);
    await logBotEvent(bot.id, "webhook_set", {
      username: botInfo.username,
    });
  } catch (error) {
    // Cleanup on failure
    await db.telegramBot.delete({ where: { id: bot.id } });
    return {
      error: `Failed to register webhook: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }

  revalidatePath("/bots");
  return { bot: { id: bot.id, botUsername: botInfo.username } };
}

export async function toggleTelegramBot(botId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const bot = await db.telegramBot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

  if (!bot) {
    return { error: "Bot not found" };
  }

  const newEnabled = !bot.isEnabled;

  if (newEnabled) {
    // Re-register webhook when enabling
    try {
      const { decrypt } = await import("@/lib/encryption");
      await registerWebhook(bot.id, decrypt(bot.token), bot.webhookSecret);
    } catch {
      return { error: "Failed to re-register webhook" };
    }
  } else {
    // Remove webhook when disabling
    try {
      const { decrypt } = await import("@/lib/encryption");
      await removeWebhook(decrypt(bot.token));
    } catch {
      // Continue even if removal fails
    }
  }

  await db.telegramBot.update({
    where: { id: botId },
    data: {
      isEnabled: newEnabled,
      ...(newEnabled ? { errorCount: 0 } : {}),
    },
  });

  clearBotCache(botId);
  revalidatePath("/bots");
  return { success: true, isEnabled: newEnabled };
}

export async function deleteTelegramBot(botId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const bot = await db.telegramBot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

  if (!bot) {
    return { error: "Bot not found" };
  }

  // Remove webhook
  try {
    const { decrypt } = await import("@/lib/encryption");
    await removeWebhook(decrypt(bot.token));
  } catch {
    // Continue even if removal fails
  }

  // Delete from database (cascades to logs)
  await db.telegramBot.delete({ where: { id: botId } });

  clearBotCache(botId);
  revalidatePath("/bots");
  return { success: true };
}

export async function rotateWebhookSecret(botId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const bot = await db.telegramBot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

  if (!bot) {
    return { error: "Bot not found" };
  }

  const newSecret = generateWebhookSecret();
  const { decrypt } = await import("@/lib/encryption");
  const token = decrypt(bot.token);

  try {
    await registerWebhook(bot.id, token, newSecret);
  } catch {
    return { error: "Failed to re-register webhook with new secret" };
  }

  await db.telegramBot.update({
    where: { id: botId },
    data: { webhookSecret: newSecret },
  });

  clearBotCache(botId);
  revalidatePath("/bots");
  return { success: true };
}

export async function reregisterAllWebhooks() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const bots = await db.telegramBot.findMany({
    where: { userId: session.user.id, isEnabled: true },
  });

  const { decrypt } = await import("@/lib/encryption");

  const results = await Promise.allSettled(
    bots.map((bot: { id: string; token: string; webhookSecret: string }) =>
      registerWebhook(bot.id, decrypt(bot.token), bot.webhookSecret)
    )
  );

  return results.map((r: PromiseSettledResult<boolean>, i: number) => ({
    botId: bots[i].id,
    success: r.status === "fulfilled",
    error: r.status === "rejected" ? String((r as PromiseRejectedResult).reason) : null,
  }));
}

export async function getTelegramBots() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return db.telegramBot.findMany({
    where: { userId: session.user.id },
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

export async function getTelegramBotLogs(
  botId: string,
  options?: { level?: string; limit?: number }
) {
  const session = await auth();
  if (!session?.user?.id) return [];

  // Verify ownership
  const bot = await db.telegramBot.findFirst({
    where: { id: botId, userId: session.user.id },
  });
  if (!bot) return [];

  return getBotLogs(botId, options);
}
