"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Minus, Plus, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { completePomodoroSession } from "@/actions/pomodoro";
import { updateTaskFields } from "@/actions/task";

type PomodoroTimerProps = {
  taskId: string;
  projectId: string;
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
  durationMinutes,
  completedCount,
}: PomodoroTimerProps) {
  const totalSeconds = durationMinutes * 60;
  const [timeRemaining, setTimeRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [localCount, setLocalCount] = useState(completedCount);
  const [duration, setDuration] = useState(durationMinutes);
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
  const progress = totalSeconds > 0 ? ((totalSeconds - timeRemaining) / totalSeconds) * 100 : 0;

  return (
    <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <Timer size={14} className="text-text-tertiary" />
        <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Pomodoro
        </span>
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
}
