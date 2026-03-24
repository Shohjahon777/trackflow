import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="flex max-w-[400px] flex-col items-center text-center">
        {/* Error code */}
        <span className="font-mono text-[48px] font-medium leading-none tracking-tight text-accent/20">
          404
        </span>

        {/* Icon */}
        <div className="mt-3 flex size-[44px] items-center justify-center rounded-full bg-accent-light">
          <Compass size={20} className="text-accent" strokeWidth={1.5} />
        </div>

        <h1 className="mt-4 text-[18px] font-medium text-text-primary">
          Page not found
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
          This page doesn&apos;t exist or has been moved. Head back to your dashboard.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
