"use client";

import { useState, useTransition } from "react";
import {
  Bot as BotIcon,
  Plus,
  Power,
  PowerOff,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  toggleTelegramBot,
  deleteTelegramBot,
  reregisterAllWebhooks,
} from "@/actions/telegram-bots";
import { CreateBotDialog } from "@/components/bots/create-bot-dialog";

type BotInfo = {
  id: string;
  name: string;
  botUsername: string;
  handlerType: string;
  isEnabled: boolean;
  lastPingAt: Date | null;
  errorCount: number;
  createdAt: Date;
};

type HandlerInfo = {
  id: string;
  name: string;
  description: string;
  commands: { command: string; description: string }[];
};

type BotDashboardProps = {
  bots: BotInfo[];
  handlerTypes: HandlerInfo[];
};

const handlerLabels: Record<string, string> = {
  notification: "Notification",
  "project-updates": "Project updates",
  "client-comms": "Client comms",
};

export function BotDashboard({ bots, handlerTypes }: BotDashboardProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleReregisterAll = () => {
    startTransition(async () => {
      await reregisterAllWebhooks();
    });
  };

  return (
    <div className="mx-auto max-w-[960px] px-6 py-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-medium text-text-primary">
            Bot assistants
          </h1>
          <p className="mt-1 text-[14px] text-text-secondary">
            Telegram bots for notifications, digests, and client communication.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {bots.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReregisterAll}
              disabled={isPending}
              className="gap-1.5"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Re-register all
            </Button>
          )}
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus size={14} />
            Add bot
          </Button>
        </div>
      </div>

      {/* Bot list */}
      {bots.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Send}
            title="No bots connected"
            description="Create a bot on Telegram via @BotFather, then add it here."
            action={
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="gap-1.5"
              >
                <Plus size={14} />
                Add your first bot
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      )}

      {/* Create bot dialog */}
      <CreateBotDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        handlerTypes={handlerTypes}
      />
    </div>
  );
}

function BotCard({ bot }: { bot: BotInfo }) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTelegramBot(bot.id);
    });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    startTransition(async () => {
      await deleteTelegramBot(bot.id);
    });
  };

  const lastPing = bot.lastPingAt
    ? formatRelativeTime(new Date(bot.lastPingAt))
    : "Never";

  return (
    <div className="rounded-lg border-[0.5px] border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-[40px] items-center justify-center rounded-full ${
              bot.isEnabled ? "bg-accent-light" : "bg-surface"
            }`}
          >
            <BotIcon
              size={18}
              className={bot.isEnabled ? "text-accent" : "text-text-tertiary"}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-medium text-text-primary">
                {bot.name}
              </h3>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  bot.isEnabled
                    ? "bg-success-light text-success"
                    : "bg-surface text-text-tertiary"
                }`}
              >
                {bot.isEnabled ? "Active" : "Disabled"}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] text-text-secondary">
              <span className="font-mono text-accent">@{bot.botUsername}</span>
              <span className="mx-1.5 text-text-tertiary">·</span>
              {handlerLabels[bot.handlerType] ?? bot.handlerType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleToggle}
            disabled={isPending}
            className="flex size-[32px] items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
            title={bot.isEnabled ? "Disable bot" : "Enable bot"}
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : bot.isEnabled ? (
              <PowerOff size={14} />
            ) : (
              <Power size={14} />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className={`flex size-[32px] items-center justify-center rounded-md transition-colors ${
              confirmDelete
                ? "bg-danger-light text-danger hover:bg-danger/20"
                : "text-text-tertiary hover:bg-surface-hover hover:text-danger"
            }`}
            title={confirmDelete ? "Click again to confirm" : "Delete bot"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Status row */}
      <div className="mt-3 flex items-center gap-4 text-[11px] text-text-tertiary">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          Last ping: {lastPing}
        </span>
        {bot.errorCount > 0 && (
          <span className="flex items-center gap-1 text-warning">
            <AlertCircle size={11} />
            {bot.errorCount} errors
          </span>
        )}
        {bot.errorCount === 0 && bot.lastPingAt && (
          <span className="flex items-center gap-1 text-success">
            <CheckCircle2 size={11} />
            Healthy
          </span>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
