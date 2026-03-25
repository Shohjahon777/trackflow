import type { Bot } from "grammy";
import type { ZodSchema } from "zod";

export interface BotHandler {
  /** Human-readable name */
  name: string;
  /** Description shown in admin UI */
  description: string;
  /** Zod schema for handler-specific config */
  configSchema: ZodSchema;
  /** Available commands for display */
  commands: { command: string; description: string }[];
  /** Attach commands and middleware to bot */
  setup: (bot: Bot, config: unknown) => void;
}

export type StoredBotInfo = {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
};

export type TelegramBotConfig = {
  id: string;
  name: string;
  botUsername: string;
  token: string;
  webhookSecret: string;
  handlerType: string;
  isEnabled: boolean;
  config: unknown;
  botInfo: StoredBotInfo | null;
  lastPingAt: Date | null;
  errorCount: number;
  userId: string;
};
