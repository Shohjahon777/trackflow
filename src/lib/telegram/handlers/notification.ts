import { z } from "zod";
import type { BotHandler } from "@/types/telegram";
import { db } from "@/lib/db";

// TODO: Remove after `prisma generate`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = db as any;

const configSchema = z.object({
  notifyOnDeploy: z.boolean().default(true),
  notifyOnMilestone: z.boolean().default(true),
  notifyOnStale: z.boolean().default(false),
});

export const notificationHandler: BotHandler = {
  name: "Notification bot",
  description:
    "Sends project notifications (deploys, milestones, stale alerts) to linked Telegram chats.",
  configSchema,
  commands: [
    { command: "start", description: "Enable notifications for this chat" },
    { command: "status", description: "View all project statuses" },
    { command: "mute", description: "Pause notifications" },
    { command: "help", description: "Show available commands" },
  ],
  setup(bot, rawConfig) {
    const config = configSchema.parse(rawConfig ?? {});

    bot.command("start", async (ctx) => {
      const chatId = ctx.chat.id;

      // We need to find the bot record to get the userId
      const botRecord = await prisma.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot configuration error. Please contact the admin.");
        return;
      }

      await prisma.telegramChat.upsert({
        where: { chatId: String(chatId) },
        create: {
          chatId: String(chatId),
          botId: botRecord.id,
          userId: botRecord.userId,
        },
        update: {},
      });

      await ctx.reply(
        "Notifications enabled for this chat.\n\n" +
          "You'll receive alerts for:\n" +
          `${config.notifyOnDeploy ? "✓" : "✗"} Deploy events\n` +
          `${config.notifyOnMilestone ? "✓" : "✗"} Milestone completions\n` +
          `${config.notifyOnStale ? "✓" : "✗"} Stale project warnings\n\n` +
          "Use /help to see all commands."
      );
    });

    bot.command("status", async (ctx) => {
      const botRecord = await prisma.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot not configured.");
        return;
      }

      const projects = await db.project.findMany({
        where: { userId: botRecord.userId },
        select: { name: true, status: true, deployUrl: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });

      if (projects.length === 0) {
        await ctx.reply("No projects found.");
        return;
      }

      const statusEmoji: Record<string, string> = {
        ACTIVE: "🟢",
        DEPLOYED: "🚀",
        STALE: "🟡",
        PAUSED: "⏸️",
        ARCHIVED: "📦",
      };

      const summary = projects
        .map((p) => {
          const emoji = statusEmoji[p.status] ?? "⚪";
          const deployed = p.deployUrl ? " (live)" : "";
          return `${emoji} <b>${p.name}</b> — ${p.status.toLowerCase()}${deployed}`;
        })
        .join("\n");

      await ctx.reply(`<b>Project statuses</b>\n\n${summary}`, {
        parse_mode: "HTML",
      });
    });

    bot.command("mute", async (ctx) => {
      const chatId = String(ctx.chat.id);

      await prisma.telegramChat.deleteMany({
        where: { chatId },
      });

      await ctx.reply(
        "Notifications paused for this chat. Use /start to re-enable."
      );
    });

    bot.command("help", async (ctx) => {
      await ctx.reply(
        "<b>TrackFlow Notification Bot</b>\n\n" +
          "/start — Enable notifications\n" +
          "/status — View project statuses\n" +
          "/mute — Pause notifications\n" +
          "/help — Show this message\n\n" +
          "<i>Powered by TrackFlow</i>",
        { parse_mode: "HTML" }
      );
    });

    // Default handler for unrecognized messages
    bot.on("message:text", async (ctx) => {
      await ctx.reply(
        "I'm a notification bot — I send you project alerts.\n" +
          "Use /help to see available commands."
      );
    });
  },
};
