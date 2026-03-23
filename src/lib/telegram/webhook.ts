import { Bot } from "grammy";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function registerWebhook(
  botId: string,
  token: string,
  secret: string
): Promise<boolean> {
  const bot = new Bot(token);
  const webhookUrl = `${BASE_URL}/api/telegram/${botId}`;

  await bot.api.setWebhook(webhookUrl, {
    secret_token: secret,
    allowed_updates: ["message", "callback_query", "my_chat_member"],
    drop_pending_updates: true,
  });

  return true;
}

export async function removeWebhook(token: string): Promise<boolean> {
  const bot = new Bot(token);
  await bot.api.deleteWebhook({ drop_pending_updates: true });
  return true;
}

export async function getWebhookInfo(token: string) {
  const bot = new Bot(token);
  return bot.api.getWebhookInfo();
}

/**
 * Validate a bot token by calling Telegram's getMe endpoint.
 * Returns the bot info if valid, null otherwise.
 */
export async function validateBotToken(token: string) {
  try {
    const bot = new Bot(token);
    const me = await bot.api.getMe();
    return {
      id: me.id,
      username: me.username,
      firstName: me.first_name,
      canJoinGroups: me.can_join_groups,
      canReadAllGroupMessages: me.can_read_all_group_messages,
    };
  } catch {
    return null;
  }
}
