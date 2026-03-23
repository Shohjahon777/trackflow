"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderKanban,
  Brain,
  FileText,
  Loader2,
  ArrowRight,
  Command,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { searchAll } from "@/actions/search";

type SearchResult = {
  type: "project" | "note";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

type CommandSearchProps = {
  isPro: boolean;
};

export function CommandSearch({ isPro }: CommandSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  // Search on query change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      startTransition(async () => {
        const data = await searchAll(query);
        setResults(data);
        setSelectedIndex(0);
      });
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      navigate(results[selectedIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "project":
        return FolderKanban;
      case "note":
        return FileText;
      default:
        return Brain;
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-[32px] items-center gap-2 rounded-md border-[0.5px] border-border bg-surface px-3 text-[13px] text-text-tertiary transition-colors hover:border-accent/40 hover:text-text-secondary"
      >
        <Search size={14} strokeWidth={1.5} />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="ml-2 hidden rounded border-[0.5px] border-border bg-card px-1.5 py-0.5 font-mono text-[10px] text-text-tertiary sm:inline">
          <Command size={10} className="mr-0.5 inline" />K
        </kbd>
      </button>

      {/* Search dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[540px] gap-0 p-0">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4">
            {isPending ? (
              <Loader2 size={16} className="shrink-0 animate-spin text-accent" />
            ) : (
              <Search size={16} className="shrink-0 text-text-tertiary" />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isPro ? "Search projects, notes, and brain..." : "Search projects..."}
              className="h-[48px] flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none"
            />
          </div>

          {/* Results */}
          <div className="max-h-[320px] overflow-y-auto">
            {query.trim() && results.length === 0 && !isPending && (
              <div className="px-4 py-8 text-center text-[13px] text-text-tertiary">
                No results for "{query}"
              </div>
            )}

            {results.length > 0 && (
              <div className="p-2">
                {results.map((result, i) => {
                  const Icon = getIcon(result.type);
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => navigate(result.href)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                        i === selectedIndex
                          ? "bg-accent-light text-accent"
                          : "text-text-secondary hover:bg-surface-hover"
                      }`}
                    >
                      <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">
                          {result.title}
                        </p>
                        <p className="truncate text-[11px] text-text-tertiary">
                          {result.subtitle}
                        </p>
                      </div>
                      <ArrowRight size={12} className="shrink-0 opacity-50" />
                    </button>
                  );
                })}
              </div>
            )}

            {!query.trim() && (
              <div className="px-4 py-6 text-center text-[12px] text-text-tertiary">
                Type to search across your workspace
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
              <span>
                <kbd className="rounded border-[0.5px] border-border px-1 font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="rounded border-[0.5px] border-border px-1 font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="rounded border-[0.5px] border-border px-1 font-mono">esc</kbd> close
              </span>
            </div>
            {!isPro && (
              <span className="text-[10px] text-accent">
                Pro: search notes & brain
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
