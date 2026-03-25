import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTelegramBots } from "@/actions/telegram-bots";
import { getAvailableHandlers } from "@/lib/telegram/handlers";
import { BotDashboard } from "@/components/bots/bot-dashboard";

export const metadata: Metadata = {
  title: "Bot assistants",
};

export default async function BotsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [bots, handlerTypes] = await Promise.all([
    getTelegramBots(),
    Promise.resolve(getAvailableHandlers()),
  ]);

  return <BotDashboard bots={bots} handlerTypes={handlerTypes} />;
}
