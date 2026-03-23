"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Brain,
  Activity,
  Share2,
  Clock,
  UserCircle,
  Settings,
  CreditCard,
  BarChart3,
  Send,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navSections = [
  {
    label: "Workspace",
    items: [
      { href: "/overview", label: "Overview", icon: LayoutDashboard },
      { href: "/projects", label: "Projects", icon: FolderKanban },
      { href: "/brain", label: "Brain", icon: Brain },
      { href: "/activity", label: "Activity", icon: Activity },
      { href: "/shares", label: "Shares", icon: Share2 },
      { href: "/time-log", label: "Time log", icon: Clock },
      { href: "/bots", label: "Bots", icon: Send },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "Profile", icon: UserCircle },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string | null;
} | null;

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  user?: SidebarUser;
};

export function Sidebar({ collapsed, onToggle, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-in-out",
        collapsed ? "w-[56px]" : "w-[240px]"
      )}
    >
      {/* Header: logo + controls */}
      <div
        className={cn(
          "flex h-[48px] items-center border-b border-border",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        {/* Logo */}
        <Link href="/overview" className="flex items-center overflow-hidden">
          <span className="font-mono text-[14px] font-medium whitespace-nowrap text-text-primary">
            {collapsed ? (
              <>T<span className="text-accent">F</span></>
            ) : (
              <>TRACK<span className="text-accent">FLOW</span></>
            )}
          </span>
        </Link>

        {/* Controls — only visible when expanded */}
        {!collapsed && (
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              onClick={onToggle}
              className="flex size-[28px] items-center justify-center rounded-md text-ash transition-colors duration-[120ms] hover:bg-surface-hover hover:text-text-secondary"
            >
              <ChevronsLeft size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
      </div>

      {/* Expand button when collapsed — sits below header */}
      {collapsed && (
        <div className="flex justify-center py-2">
          <button
            onClick={onToggle}
            className="flex size-[32px] items-center justify-center rounded-md text-ash transition-colors duration-[120ms] hover:bg-surface-hover hover:text-text-secondary"
          >
            <ChevronsRight size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {navSections.map((section, sectionIdx) => (
          <div key={section.label} className={cn(sectionIdx > 0 && (collapsed ? "mt-2 border-t border-border pt-2" : "mt-4"))}>
            {!collapsed && (
              <div className="mb-2 px-2">
                <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
                  {section.label}
                </span>
              </div>
            )}

            <ul className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);

                const linkEl = collapsed ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex size-[36px] items-center justify-center rounded-md transition-all duration-[120ms] ease-in-out",
                      isActive
                        ? "bg-accent-light text-accent"
                        : "text-ash hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    <item.icon
                      size={18}
                      strokeWidth={isActive ? 1.75 : 1.5}
                      className="shrink-0"
                    />
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-[36px] items-center gap-3 rounded-md px-3 text-[14px] transition-all duration-[120ms] ease-in-out",
                      isActive
                        ? "bg-accent-light text-accent"
                        : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    <item.icon
                      size={16}
                      strokeWidth={isActive ? 1.75 : 1.5}
                      className="shrink-0"
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );

                if (collapsed) {
                  return (
                    <li key={item.href} className="flex justify-center">
                      <Tooltip>
                        <TooltipTrigger render={linkEl} />
                        <TooltipContent side="right" sideOffset={8}>
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                }

                return <li key={item.href}>{linkEl}</li>;
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile section */}
      <ProfileSection collapsed={collapsed} user={user} />
    </aside>
  );
}

function ProfileSection({ collapsed, user }: { collapsed: boolean; user?: SidebarUser }) {
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "U";

  const displayName = user?.name ?? "User";
  const displayEmail = user?.username ? `@${user.username}` : user?.email ?? "";
  const avatarUrl = user?.image;

  return (
    <div
      className={cn(
        "border-t border-border",
        collapsed ? "flex flex-col items-center gap-1 py-2" : "p-3"
      )}
    >
      {collapsed ? (
        <>
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="/settings"
                  className="flex size-[36px] items-center justify-center rounded-md transition-colors duration-[120ms] hover:bg-surface-hover"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="size-[28px] rounded-full"
                    />
                  ) : (
                    <div className="flex size-[28px] items-center justify-center rounded-full bg-accent-light text-[11px] font-medium text-accent">
                      {initials}
                    </div>
                  )}
                </Link>
              }
            />
            <TooltipContent side="right" sideOffset={8}>
              {displayName}
            </TooltipContent>
          </Tooltip>
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        </>
      ) : (
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md p-1 transition-colors duration-[120ms] hover:bg-surface-hover"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="size-[32px] shrink-0 rounded-full"
            />
          ) : (
            <div className="flex size-[32px] shrink-0 items-center justify-center rounded-full bg-accent-light text-[12px] font-medium text-accent">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-text-primary">
              {displayName}
            </p>
            <p className="truncate text-[11px] text-text-tertiary">
              {displayEmail}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
