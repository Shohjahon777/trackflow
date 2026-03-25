import { Bot } from "grammy";
import type { UserFromGetMe } from "grammy/types";
import { handlers } from "./handlers";
import type { TelegramBotConfig } from "@/types/telegram";

const botCache = new Map<string, Bot>();

export function createBotInstance(config: TelegramBotConfig): Bot {
  // Return cached instance if available (survives warm serverless invocations)
  const cached = botCache.get(config.id);
  if (cached) return cached;

  // Pass botInfo to constructor so grammy skips the init() / getMe call.
  // Without this, handleUpdate() throws "Bot not initialized".
  const botInfo = config.botInfo
    ? ({
        id: config.botInfo.id,
        is_bot: true,
        first_name: config.botInfo.first_name,
        username: config.botInfo.username,
        can_join_groups: config.botInfo.can_join_groups ?? false,
        can_read_all_group_messages:
          config.botInfo.can_read_all_group_messages ?? false,
        supports_inline_queries:
          config.botInfo.supports_inline_queries ?? false,
      } as UserFromGetMe)
    : undefined;

  const bot = new Bot(config.token, botInfo ? { botInfo } : undefined);

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
