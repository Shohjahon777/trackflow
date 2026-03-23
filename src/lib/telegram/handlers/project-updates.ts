import { z } from "zod";
import type { BotHandler } from "@/types/telegram";
import { db } from "@/lib/db";


const configSchema = z.object({
  digestFrequency: z
    .enum(["daily", "weekly"])
    .default("weekly"),
  includeCommits: z.boolean().default(true),
  includeMilestones: z.boolean().default(true),
});

export const projectUpdatesHandler: BotHandler = {
  name: "Project updates",
  description:
    "Sends daily or weekly project digest messages with progress summaries.",
  configSchema,
  commands: [
    { command: "start", description: "Subscribe to project updates" },
    { command: "digest", description: "Get a project digest now" },
    { command: "subscribe", description: "Choose which projects to follow" },
    { command: "unsubscribe", description: "Stop receiving updates" },
    { command: "help", description: "Show available commands" },
  ],
  setup(bot, rawConfig) {
    configSchema.parse(rawConfig ?? {});

    bot.command("start", async (ctx) => {
      const chatId = ctx.chat.id;
      const botRecord = await db.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot configuration error.");
        return;
      }

      await db.telegramChat.upsert({
        where: { chatId: String(chatId) },
        create: {
          chatId: String(chatId),
          botId: botRecord.id,
          userId: botRecord.userId,
        },
        update: {},
      });

      await ctx.reply(
        "Subscribed to project updates!\n\n" +
          "Use /digest to get a summary now, or wait for the automatic digest.\n" +
          "Use /help to see all commands."
      );
    });

    bot.command("digest", async (ctx) => {
      const botRecord = await db.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot not configured.");
        return;
      }

      const projects = await db.project.findMany({
        where: {
          userId: botRecord.userId,
          status: { in: ["ACTIVE", "DEPLOYED"] },
        },
        select: {
          name: true,
          status: true,
          stack: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      if (projects.length === 0) {
        await ctx.reply("No active projects to report on.");
        return;
      }

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const recentlyUpdated = projects.filter(
        (p) => p.updatedAt >= weekAgo
      );

      let digest = "<b>📊 Project Digest</b>\n\n";

      if (recentlyUpdated.length > 0) {
        digest += "<b>Active this week:</b>\n";
        for (const p of recentlyUpdated) {
          const days = Math.floor(
            (now.getTime() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          digest += `• <b>${p.name}</b> — updated ${days === 0 ? "today" : `${days}d ago`}\n`;
        }
      }

      const staleProjects = projects.filter(
        (p) => p.updatedAt < weekAgo
      );

      if (staleProjects.length > 0) {
        digest += "\n<b>Needs attention:</b>\n";
        for (const p of staleProjects) {
          const days = Math.floor(
            (now.getTime() - p.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          digest += `• ${p.name} — ${days}d since last update\n`;
        }
      }

      digest += `\n<i>${projects.length} total projects tracked</i>`;

      await ctx.reply(digest, { parse_mode: "HTML" });
    });

    bot.command("unsubscribe", async (ctx) => {
      await db.telegramChat.deleteMany({
        where: { chatId: String(ctx.chat.id) },
      });
      await ctx.reply("Unsubscribed from project updates.");
    });

    bot.command("help", async (ctx) => {
      await ctx.reply(
        "<b>TrackFlow Project Updates Bot</b>\n\n" +
          "/start — Subscribe to updates\n" +
          "/digest — Get a project digest now\n" +
          "/unsubscribe — Stop receiving updates\n" +
          "/help — Show this message\n\n" +
          "<i>Powered by TrackFlow</i>",
        { parse_mode: "HTML" }
      );
    });

    bot.on("message:text", async (ctx) => {
      await ctx.reply(
        "Use /digest to get a project summary, or /help for all commands."
      );
    });
  },
};
