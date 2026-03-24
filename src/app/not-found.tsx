import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="flex max-w-[440px] flex-col items-center text-center">
        {/* Error code */}
        <span className="font-mono text-[64px] font-medium leading-none tracking-tight text-accent/20">
          404
        </span>

        {/* Icon */}
        <div className="mt-4 flex size-[48px] items-center justify-center rounded-full bg-accent-light">
          <Compass size={24} className="text-accent" strokeWidth={1.5} />
        </div>

        <h1 className="mt-5 text-[18px] font-medium text-text-primary">
          Page not found
        </h1>
        <p className="mt-2 text-[14px] leading-[1.6] text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or head back to your dashboard.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Back to dashboard
          </Link>
        </div>

        {/* Subtle branding */}
        <p className="mt-12 font-mono text-[11px] tracking-[0.04em] text-text-tertiary">
          <span className="text-text-secondary">TRACK</span>
          <span className="text-accent">FLOW</span>
        </p>
      </div>
    </div>
  );
}
