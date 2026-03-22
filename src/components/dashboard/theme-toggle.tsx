"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <button
      onClick={toggle}
      className="flex size-[28px] items-center justify-center rounded-md text-ash transition-colors duration-[120ms] hover:bg-surface-hover hover:text-text-secondary"
    >
      {theme === "light" ? (
        <Moon size={14} strokeWidth={1.5} />
      ) : (
        <Sun size={14} strokeWidth={1.5} />
      )}
    </button>
  );
}
