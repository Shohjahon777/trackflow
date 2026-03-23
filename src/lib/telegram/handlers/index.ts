import { notificationHandler } from "./notification";
import { projectUpdatesHandler } from "./project-updates";
import { clientCommsHandler } from "./client-comms";
import type { BotHandler } from "@/types/telegram";

export const handlers: Record<string, BotHandler> = {
  notification: notificationHandler,
  "project-updates": projectUpdatesHandler,
  "client-comms": clientCommsHandler,
};

/** Get all available handler types for the admin UI */
export function getAvailableHandlers() {
  return Object.entries(handlers).map(([id, handler]) => ({
    id,
    name: handler.name,
    description: handler.description,
    commands: handler.commands,
  }));
}
