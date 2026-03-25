"use client";

import { useState, useTransition } from "react";
import {
  Bot as BotIcon,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTelegramBot } from "@/actions/telegram-bots";

type HandlerInfo = {
  id: string;
  name: string;
  description: string;
  commands: { command: string; description: string }[];
};

type CreateBotDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handlerTypes: HandlerInfo[];
  existingBotCount: number;
};

const enabledHandlers = new Set(["notification"]);

export function CreateBotDialog({
  open,
  onOpenChange,
  handlerTypes,
  existingBotCount,
}: CreateBotDialogProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [handlerType, setHandlerType] = useState("notification");
  const [error, setError] = useState("");
  const [resultUsername, setResultUsername] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (!name.trim() || !token.trim()) {
      setError("Name and token are required.");
      return;
    }

    setError("");
    const formData = new FormData();
    formData.set("name", name.trim());
    formData.set("token", token.trim());
    formData.set("handlerType", handlerType);

    startTransition(async () => {
      const result = await createTelegramBot(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("bot" in result && result.bot) {
        setResultUsername(result.bot.botUsername);
        setStep("success");
      }
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setStep("form");
      setName("");
      setToken("");
      setError("");
      setResultUsername("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[480px]">
        {step === "form" ? (
          <>
            <DialogHeader>
              <div className="flex size-[40px] items-center justify-center rounded-full bg-accent-light">
                <BotIcon size={20} className="text-accent" strokeWidth={1.5} />
              </div>
              <DialogTitle className="mt-3 text-[16px]">
                Add Telegram bot
              </DialogTitle>
              <p className="mt-1 text-[13px] text-text-secondary">
                Create a bot via{" "}
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-accent hover:underline"
                >
                  @BotFather
                  <ExternalLink size={11} />
                </a>{" "}
                on Telegram, then paste the token here.
              </p>
            </DialogHeader>

            {existingBotCount >= 1 ? (
              <div className="mt-4 rounded-md border-[0.5px] border-border bg-surface p-4 text-center">
                <Lock size={16} className="mx-auto text-text-tertiary" strokeWidth={1.5} />
                <p className="mt-2 text-[13px] font-medium text-text-primary">
                  Bot limit reached
                </p>
                <p className="mt-1 text-[12px] text-text-secondary">
                  Free and Pro accounts can have 1 bot. Delete your existing bot to create a new one.
                </p>
                <Button variant="outline" size="sm" onClick={handleClose} className="mt-4">
                  Got it
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="text-[12px] font-medium text-text-secondary">
                      Bot name
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Project notifier"
                      className="mt-1"
                    />
                  </div>

                  {/* Token */}
                  <div>
                    <label className="text-[12px] font-medium text-text-secondary">
                      Bot API token
                    </label>
                    <Input
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="123456:ABC-DEF..."
                      className="mt-1 font-mono text-[13px]"
                      type="password"
                    />
                    <p className="mt-1 text-[11px] text-text-tertiary">
                      From @BotFather → /newbot → copy the token
                    </p>
                  </div>

                  {/* Handler type */}
                  <div>
                    <label className="text-[12px] font-medium text-text-secondary">
                      Bot type
                    </label>
                    <div className="mt-2 space-y-2">
                      {handlerTypes.map((h) => {
                        const isEnabled = enabledHandlers.has(h.id);
                        return (
                          <button
                            key={h.id}
                            onClick={() => isEnabled && setHandlerType(h.id)}
                            disabled={!isEnabled}
                            className={`relative w-full rounded-md border-[0.5px] p-3 text-left transition-colors ${
                              !isEnabled
                                ? "cursor-not-allowed border-border opacity-50"
                                : handlerType === h.id
                                  ? "border-accent/40 bg-accent-light/30"
                                  : "border-border hover:border-accent/20"
                            }`}
                          >
                            <p className={`text-[13px] font-medium ${isEnabled ? "text-text-primary" : "text-text-tertiary"}`}>
                              {h.name}
                            </p>
                            <p className={`mt-0.5 text-[11px] ${isEnabled ? "text-text-secondary" : "text-text-tertiary/70 blur-[1px]"}`}>
                              {h.description}
                            </p>
                            {!isEnabled && (
                              <span className="absolute right-3 top-3 rounded px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.06em] bg-surface-hover text-text-tertiary">
                                Soon
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {error && (
                    <p className="text-[12px] text-danger">{error}</p>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="gap-1.5"
                  >
                    {isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <BotIcon size={14} />
                    )}
                    Connect bot
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex size-[48px] items-center justify-center rounded-full bg-success-light">
                <CheckCircle2
                  size={24}
                  className="text-success"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="mt-4 text-[16px] font-medium text-text-primary">
                Bot connected
              </h3>
              <p className="mt-1 text-[13px] text-text-secondary">
                <span className="font-mono text-accent">
                  @{resultUsername}
                </span>{" "}
                is now connected and ready to receive messages.
              </p>
              <p className="mt-3 text-[12px] text-text-tertiary">
                Send <span className="font-mono">/start</span> to your bot on
                Telegram to begin.
              </p>
              <Button size="sm" onClick={handleClose} className="mt-6">
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
