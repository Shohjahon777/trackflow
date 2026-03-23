"use client";

import { CommandSearch } from "@/components/dashboard/command-search";

type TopNavProps = {
  user?: {
    email?: string | null;
    username?: string | null;
  } | null;
  isPro?: boolean;
};

export function TopNav({ user, isPro = false }: TopNavProps) {
  return (
    <header className="flex h-[48px] items-center justify-between border-b border-border bg-background px-4">
      <CommandSearch isPro={isPro} />
      {user && (
        <span className="text-[12px] text-text-tertiary">
          {user.username ? (
            <span className="font-mono text-accent">@{user.username}</span>
          ) : (
            user.email
          )}
        </span>
      )}
    </header>
  );
}
