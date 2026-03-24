"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

export default function RootError({
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
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-[440px] flex-col items-center text-center">
        {/* Error code */}
        <span className="font-mono text-[64px] font-medium leading-none tracking-tight text-accent/20">
          500
        </span>

        {/* Icon */}
        <div className="mt-4 flex size-[48px] items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle size={24} className="text-danger" strokeWidth={1.5} />
        </div>

        <h1 className="mt-5 text-[18px] font-medium text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
          An unexpected error occurred. This has been logged and we&apos;ll
          look into it. You can try again or head back to your dashboard.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-[11px] text-text-tertiary">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <RotateCcw size={14} strokeWidth={1.5} />
            Try again
          </button>
          <a
            href="/overview"
            className="flex items-center gap-2 rounded-md border-[0.5px] border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Dashboard
          </a>
        </div>

        {/* Branding */}
        <p className="mt-12 font-mono text-[11px] tracking-[0.04em] text-text-tertiary">
          <span className="text-text-secondary">TRACK</span>
          <span className="text-accent">FLOW</span>
        </p>
      </div>
    </div>
  );
}
