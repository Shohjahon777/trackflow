import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { checkPlan } from "@/lib/plan";
import { getTelegramBots } from "@/actions/telegram-bots";
import { getAvailableHandlers } from "@/lib/telegram/handlers";
import { PlanGate } from "@/components/billing/plan-gate";
import { BotDashboard } from "@/components/bots/bot-dashboard";

export const metadata: Metadata = {
  title: "Bot assistants",
};

export default async function BotsPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const plan = await checkPlan(userId);

  if (!plan.isPro) {
    return (
      <div className="mx-auto max-w-[960px] px-6 py-8">
        <h1 className="text-[20px] font-medium text-text-primary">
          Bot assistants
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Connect Telegram bots to your projects for notifications, digests, and
          client communication.
        </p>
        <div className="mt-8">
          <PlanGate feature="Bot assistants" isPro={false}>
            <BotPlaceholder />
          </PlanGate>
        </div>
      </div>
    );
  }

  const [bots, handlerTypes] = await Promise.all([
    getTelegramBots(),
    Promise.resolve(getAvailableHandlers()),
  ]);

  return (
    <BotDashboard
      bots={bots}
      handlerTypes={handlerTypes}
    />
  );
}

function BotPlaceholder() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-lg border-[0.5px] border-border bg-card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-[36px] rounded-full bg-surface" />
            <div className="space-y-1">
              <div className="h-[14px] w-[140px] rounded bg-surface" />
              <div className="h-[12px] w-[200px] rounded bg-surface" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
