"use client";

import { LayoutGrid, List, Columns3 } from "lucide-react";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ViewToggle() {
  const [view, setView] = useQueryState("view", { defaultValue: "grid" });

  return (
    <div className="flex items-center gap-0.5 rounded-md border-[0.5px] border-border p-0.5">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setView("grid")}
        className={cn(
          "rounded-sm",
          view === "grid"
            ? "bg-accent-light text-accent"
            : "text-text-tertiary"
        )}
      >
        <LayoutGrid size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setView("list")}
        className={cn(
          "rounded-sm",
          view === "list"
            ? "bg-accent-light text-accent"
            : "text-text-tertiary"
        )}
      >
        <List size={14} />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={() => setView("kanban")}
        className={cn(
          "rounded-sm",
          view === "kanban"
            ? "bg-accent-light text-accent"
            : "text-text-tertiary"
        )}
      >
        <Columns3 size={14} />
      </Button>
    </div>
  );
}
