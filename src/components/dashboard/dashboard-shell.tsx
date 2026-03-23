"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNav } from "@/components/dashboard/top-nav";

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
} | null;

export function DashboardShell({
  children,
  user,
  isPro = false,
}: {
  children: React.ReactNode;
  user?: SessionUser;
  isPro?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        user={user}
      />
      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-200">
        <TopNav user={user} isPro={isPro} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
