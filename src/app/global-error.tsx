"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, ArrowLeft } from "lucide-react";

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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAFAF8",
          fontFamily:
            "'Geist Sans', system-ui, -apple-system, sans-serif",
          color: "#3D3D38",
          padding: "24px",
        }}
      >
        <div
          style={{
            maxWidth: 440,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Error code */}
          <span
            style={{
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              fontSize: 64,
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "rgba(99, 102, 160, 0.2)",
            }}
          >
            500
          </span>

          {/* Icon */}
          <div
            style={{
              marginTop: 16,
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "#FBEDED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AlertTriangle size={24} color="#C26A6A" strokeWidth={1.5} />
          </div>

          <h1
            style={{
              marginTop: 20,
              fontSize: 18,
              fontWeight: 500,
              color: "#1C1C19",
            }}
          >
            Something went wrong
          </h1>
          <p
            style={{
              marginTop: 8,
              fontSize: 14,
              lineHeight: 1.6,
              color: "#6B6B64",
            }}
          >
            An unexpected error occurred. This has been logged and we&apos;ll
            look into it. You can try again or head back to your dashboard.
          </p>

          {error.digest && (
            <p
              style={{
                marginTop: 12,
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                fontSize: 11,
                color: "#9C9C95",
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          <div
            style={{
              marginTop: 32,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={reset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 8,
                backgroundColor: "#6366A0",
                color: "#fff",
                border: "none",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <RotateCcw size={14} strokeWidth={1.5} />
              Try again
            </button>
            <a
              href="/overview"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 8,
                backgroundColor: "transparent",
                color: "#6B6B64",
                border: "0.5px solid #D4D4CE",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "none",
                fontFamily: "inherit",
              }}
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Dashboard
            </a>
          </div>

          {/* Branding */}
          <p
            style={{
              marginTop: 48,
              fontFamily: "'JetBrains Mono', Consolas, monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "#9C9C95",
            }}
          >
            <span style={{ color: "#6B6B64" }}>TRACK</span>
            <span style={{ color: "#6366A0" }}>FLOW</span>
          </p>
        </div>
      </body>
    </html>
  );
}
