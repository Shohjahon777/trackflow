import { Bot } from "grammy";
import { handlers } from "./handlers";
import type { TelegramBotConfig } from "@/types/telegram";

const botCache = new Map<string, Bot>();

export function createBotInstance(config: TelegramBotConfig): Bot {
  // Return cached instance if available (survives warm serverless invocations)
  const cached = botCache.get(config.id);
  if (cached) return cached;

  const bot = new Bot(config.token);

  // Attach handler based on handlerType
  const handler = handlers[config.handlerType];
  if (!handler) {
    throw new Error(`Unknown handler type: ${config.handlerType}`);
  }
  handler.setup(bot, config.config);

  // Cache for reuse within same serverless invocation
  botCache.set(config.id, bot);
  return bot;
}

export function clearBotCache(botId?: string) {
  if (botId) {
    botCache.delete(botId);
  } else {
    botCache.clear();
  }
}
