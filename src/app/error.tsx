"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
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
      <div className="flex max-w-[400px] flex-col items-center text-center">
        <div className="flex size-[48px] items-center justify-center rounded-full bg-danger-bg">
          <AlertTriangle size={24} className="text-danger" strokeWidth={1.5} />
        </div>
        <h1 className="mt-4 text-[18px] font-medium text-text-primary">
          Something went wrong
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="mt-6">
          Try again
        </Button>
      </div>
    </div>
  );
}
