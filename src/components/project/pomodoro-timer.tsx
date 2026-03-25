"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Minus,
  Plus,
  Timer,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { completePomodoroSession } from "@/actions/pomodoro";
import { updateTaskFields } from "@/actions/task";

type PomodoroTimerProps = {
  taskId: string;
  projectId: string;
  taskName?: string;
  durationMinutes: number;
  completedCount: number;
};

type StoredState = {
  timeRemaining: number;
  isRunning: boolean;
  startedAt: number | null;
};

function getStorageKey(taskId: string) {
  return `pomodoro-${taskId}`;
}

function loadState(taskId: string): StoredState | null {
  try {
    const raw = localStorage.getItem(getStorageKey(taskId));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(taskId: string, state: StoredState) {
  try {
    localStorage.setItem(getStorageKey(taskId), JSON.stringify(state));
  } catch {
    // localStorage may be full or disabled
  }
}

function clearState(taskId: string) {
  try {
    localStorage.removeItem(getStorageKey(taskId));
  } catch {
    // ignore
  }
}

export function PomodoroTimer({
  taskId,
  projectId,
  taskName,
  durationMinutes,
  completedCount,
}: PomodoroTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [localCount, setLocalCount] = useState(completedCount);
  const [duration, setDuration] = useState(durationMinutes);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const completingRef = useRef(false);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const stored = loadState(taskId);
    if (stored) {
      if (stored.isRunning && stored.startedAt) {
        const elapsed = Math.floor((Date.now() - stored.startedAt) / 1000);
        const remaining = Math.max(0, stored.timeRemaining - elapsed);
        setTimeRemaining(remaining);
        if (remaining > 0) {
          setIsRunning(true);
          startedAtRef.current = stored.startedAt;
        } else {
          clearState(taskId);
        }
      } else {
        setTimeRemaining(stored.timeRemaining);
      }
    }
  }, [taskId]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsRunning(false);
          clearState(taskId);
          if (!completingRef.current) {
            completingRef.current = true;
            handleComplete();
          }
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, taskId]);

  // Persist state when running
  useEffect(() => {
    if (isRunning) {
      saveState(taskId, {
        timeRemaining,
        isRunning: true,
        startedAt: startedAtRef.current,
      });
    }
  }, [timeRemaining, isRunning, taskId]);

  // Keyboard shortcuts for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
          pause();
        } else {
          start();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, isRunning]);

  const handleComplete = useCallback(async () => {
    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Pomodoro complete!", {
        body: "Time for a break.",
        icon: "/favicon.ico",
      });
    }
    await completePomodoroSession(taskId);
    setLocalCount((c) => c + 1);
    completingRef.current = false;
  }, [taskId]);

  function start() {
    if (timeRemaining <= 0) {
      setTimeRemaining(duration * 60);
    }
    setIsRunning(true);
    startedAtRef.current = Date.now();
    saveState(taskId, {
      timeRemaining: timeRemaining <= 0 ? duration * 60 : timeRemaining,
      isRunning: true,
      startedAt: Date.now(),
    });

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  function pause() {
    setIsRunning(false);
    startedAtRef.current = null;
    saveState(taskId, {
      timeRemaining,
      isRunning: false,
      startedAt: null,
    });
  }

  function reset() {
    setIsRunning(false);
    setTimeRemaining(duration * 60);
    startedAtRef.current = null;
    clearState(taskId);
  }

  async function adjustDuration(delta: number) {
    const next = Math.max(1, Math.min(120, duration + delta));
    setDuration(next);
    if (!isRunning && timeRemaining === duration * 60) {
      setTimeRemaining(next * 60);
    }
    await updateTaskFields(taskId, { pomodoroMinutes: next });
  }

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const currentTotal = duration * 60;
  const progress = currentTotal > 0 ? ((currentTotal - timeRemaining) / currentTotal) * 100 : 0;

  // SVG circular progress values
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference * (1 - progress / 100);

  const compactView = (
    <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer size={14} className="text-text-tertiary" />
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Pomodoro
          </span>
        </div>
        <button
          onClick={() => setIsFullscreen(true)}
          className="flex size-[24px] items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-surface-hover hover:text-text-primary"
          title="Fullscreen timer"
        >
          <Maximize2 size={12} strokeWidth={1.5} />
        </button>
      </div>

      {/* Timer display */}
      <div className="mt-3 text-center">
        <span
          className={cn(
            "font-mono text-[32px] font-medium tabular-nums",
            isRunning ? "text-accent" : "text-text-primary"
          )}
        >
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>

        {/* Progress bar */}
        <div className="mx-auto mt-2 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-3 flex items-center justify-center gap-2">
        {isRunning ? (
          <button
            onClick={pause}
            className="flex h-8 w-8 items-center justify-center rounded-md border-[0.5px] border-border bg-background text-text-primary transition-colors hover:bg-surface"
          >
            <Pause size={14} />
          </button>
        ) : (
          <button
            onClick={start}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white transition-colors hover:bg-accent/90"
          >
            <Play size={14} />
          </button>
        )}
        <button
          onClick={reset}
          className="flex h-8 w-8 items-center justify-center rounded-md border-[0.5px] border-border bg-background text-text-tertiary transition-colors hover:text-text-primary"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Duration adjustment */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={() => adjustDuration(-5)}
          disabled={isRunning}
          className="flex h-6 w-6 items-center justify-center rounded border-[0.5px] border-border text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-30"
        >
          <Minus size={10} />
        </button>
        <span className="font-mono text-[12px] text-text-secondary">
          {duration}m
        </span>
        <button
          onClick={() => adjustDuration(5)}
          disabled={isRunning}
          className="flex h-6 w-6 items-center justify-center rounded border-[0.5px] border-border text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-30"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Completed count */}
      <div className="mt-2 text-center">
        <span className="font-mono text-[11px] text-text-tertiary">
          {localCount} pomodoro{localCount !== 1 ? "s" : ""} completed
        </span>
      </div>
    </div>
  );

  const fullscreenView = isFullscreen
    ? createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink/95 backdrop-blur-sm">
          {/* Close button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute right-6 top-6 flex size-[40px] items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
            title="Exit fullscreen (Esc)"
          >
            <X size={20} strokeWidth={1.5} />
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute left-6 top-6 flex size-[40px] items-center justify-center rounded-full text-white/40 transition-colors hover:bg-white/10 hover:text-white/80"
            title="Minimize"
          >
            <Minimize2 size={18} strokeWidth={1.5} />
          </button>

          <div className="flex flex-col items-center">
            {/* Task name */}
            {taskName && (
              <p className="mb-8 text-[14px] text-white/50">{taskName}</p>
            )}

            {/* Circular progress ring + timer */}
            <div className="relative flex items-center justify-center" style={{ width: 320, height: 320 }}>
              <svg className="absolute inset-0" viewBox="0 0 320 320">
                {/* Background ring */}
                <circle
                  cx="160"
                  cy="160"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  className="text-white/10"
                  strokeWidth="4"
                />
                {/* Progress ring */}
                <circle
                  cx="160"
                  cy="160"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  className="text-accent"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  transform="rotate(-90 160 160)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span
                className={cn(
                  "font-mono text-[80px] font-medium tabular-nums leading-none",
                  isRunning ? "text-accent" : "text-white"
                )}
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </span>
            </div>

            {/* Duration label */}
            <p className="mt-4 font-mono text-[14px] text-white/30">
              {duration} min session
            </p>

            {/* Controls */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={reset}
                className="flex size-[48px] items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
              >
                <RotateCcw size={20} strokeWidth={1.5} />
              </button>
              {isRunning ? (
                <button
                  onClick={pause}
                  className="flex size-[64px] items-center justify-center rounded-full border-2 border-accent/40 bg-accent/10 text-accent transition-colors hover:bg-accent/20"
                >
                  <Pause size={28} strokeWidth={1.5} />
                </button>
              ) : (
                <button
                  onClick={start}
                  className="flex size-[64px] items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90"
                >
                  <Play size={28} className="ml-1" strokeWidth={1.5} />
                </button>
              )}
              <div className="flex size-[48px] items-center justify-center">
                {/* Spacer to keep play centered */}
              </div>
            </div>

            {/* Session count */}
            <p className="mt-8 font-mono text-[13px] text-white/30">
              {localCount} pomodoro{localCount !== 1 ? "s" : ""} completed
            </p>

            {/* Keyboard hint */}
            <p className="mt-4 text-[11px] text-white/20">
              Space to {isRunning ? "pause" : "start"} · Esc to exit
            </p>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {compactView}
      {fullscreenView}
    </>
  );
}
