"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="flex max-w-[400px] flex-col items-center text-center">
        {/* Error code */}
        <span className="font-mono text-[48px] font-medium leading-none tracking-tight text-accent/20">
          500
        </span>

        {/* Icon */}
        <div className="mt-3 flex size-[44px] items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle size={20} className="text-danger" strokeWidth={1.5} />
        </div>

        <h1 className="mt-4 text-[18px] font-medium text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
          An error occurred while loading this page. Try again or go back to the overview.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-text-tertiary">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            Try again
          </button>
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-md border-[0.5px] border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <Home size={14} strokeWidth={1.5} />
            Overview
          </Link>
        </div>
      </div>
    </div>
  );
}
