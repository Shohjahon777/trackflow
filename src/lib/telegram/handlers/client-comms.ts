import { z } from "zod";
import type { BotHandler } from "@/types/telegram";
import { db } from "@/lib/db";


const configSchema = z.object({
  projectId: z.string().optional(),
  autoReply: z.boolean().default(true),
});

export const clientCommsHandler: BotHandler = {
  name: "Client communication",
  description:
    "Relay messages between freelancer and client. Clients can request status and report issues.",
  configSchema,
  commands: [
    { command: "start", description: "Link this chat to TrackFlow" },
    { command: "link", description: "Link to a project via share token" },
    { command: "status", description: "View linked project status" },
    { command: "milestone", description: "View project milestones" },
    { command: "help", description: "Show available commands" },
  ],
  setup(bot, rawConfig) {
    const config = configSchema.parse(rawConfig ?? {});

    bot.command("start", async (ctx) => {
      const botRecord = await db.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot configuration error.");
        return;
      }

      await db.telegramChat.upsert({
        where: { chatId: String(ctx.chat.id) },
        create: {
          chatId: String(ctx.chat.id),
          botId: botRecord.id,
          userId: botRecord.userId,
        },
        update: {},
      });

      if (config.projectId) {
        const project = await db.project.findUnique({
          where: { id: config.projectId },
          select: { name: true },
        });

        await ctx.reply(
          `Connected to <b>${project?.name ?? "project"}</b>.\n\n` +
            "Use /status to check progress or /milestone to see milestones.\n" +
            "Use /help for all commands.",
          { parse_mode: "HTML" }
        );
      } else {
        await ctx.reply(
          "Welcome to TrackFlow Client Bot!\n\n" +
            "Use /link [share-token] to connect to a project.\n" +
            "Use /help for all commands."
        );
      }
    });

    bot.command("link", async (ctx) => {
      const token = ctx.match?.trim();
      if (!token) {
        await ctx.reply("Usage: /link [share-token]\n\nGet the share token from your developer.");
        return;
      }

      const project = await db.project.findUnique({
        where: { shareToken: token },
        select: { id: true, name: true, status: true },
      });

      if (!project) {
        await ctx.reply("Invalid share token. Please check with your developer.");
        return;
      }

      await ctx.reply(
        `✓ Linked to <b>${project.name}</b> (${project.status.toLowerCase()})\n\n` +
          "You can now use:\n" +
          "/status — Check project progress\n" +
          "/milestone — View milestones",
        { parse_mode: "HTML" }
      );
    });

    bot.command("status", async (ctx) => {
      const botRecord = await db.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord) {
        await ctx.reply("Bot not configured.");
        return;
      }

      const projectId = config.projectId;
      if (!projectId) {
        // Show all projects
        const projects = await db.project.findMany({
          where: { userId: botRecord.userId, status: { in: ["ACTIVE", "DEPLOYED"] } },
          select: { name: true, status: true, deployUrl: true },
          take: 5,
        });

        if (projects.length === 0) {
          await ctx.reply("No active projects.");
          return;
        }

        const list = projects
          .map((p) => `• <b>${p.name}</b> — ${p.status.toLowerCase()}${p.deployUrl ? " 🔗" : ""}`)
          .join("\n");

        await ctx.reply(`<b>Active projects</b>\n\n${list}`, {
          parse_mode: "HTML",
        });
        return;
      }

      const project = await db.project.findUnique({
        where: { id: projectId },
        select: {
          name: true,
          status: true,
          description: true,
          stack: true,
          deployUrl: true,
          updatedAt: true,
        },
      });

      if (!project) {
        await ctx.reply("Project not found.");
        return;
      }

      const updatedDays = Math.floor(
        (Date.now() - project.updatedAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      let msg = `<b>${project.name}</b>\n`;
      msg += `Status: ${project.status.toLowerCase()}\n`;
      if (project.description) msg += `\n${project.description}\n`;
      if (project.stack.length) msg += `\nStack: ${project.stack.join(", ")}\n`;
      if (project.deployUrl) msg += `\n🔗 <a href="${project.deployUrl}">Live site</a>\n`;
      msg += `\n<i>Last updated ${updatedDays === 0 ? "today" : `${updatedDays} days ago`}</i>`;

      await ctx.reply(msg, { parse_mode: "HTML" });
    });

    bot.command("milestone", async (ctx) => {
      const botRecord = await db.telegramBot.findFirst({
        where: { botUsername: ctx.me.username },
      });

      if (!botRecord || !config.projectId) {
        await ctx.reply("No project linked. Use /link [token] first.");
        return;
      }

      // TODO: enable after prisma generate
      // const milestones = await db.milestone.findMany({
      //   where: { projectId: config.projectId },
      //   orderBy: { order: "asc" },
      // });

      await ctx.reply(
        "Milestones feature coming soon. Check the share link for now."
      );
    });

    bot.command("help", async (ctx) => {
      await ctx.reply(
        "<b>TrackFlow Client Bot</b>\n\n" +
          "/start — Connect this chat\n" +
          "/link [token] — Link to a project\n" +
          "/status — Check project status\n" +
          "/milestone — View milestones\n" +
          "/help — Show this message\n\n" +
          "<i>Powered by TrackFlow</i>",
        { parse_mode: "HTML" }
      );
    });

    // Auto-reply for unrecognized messages
    if (config.autoReply) {
      bot.on("message:text", async (ctx) => {
        await ctx.reply(
          "I received your message. The developer will be notified.\n\n" +
            "For quick info, try /status or /help."
        );
      });
    }
  },
};
