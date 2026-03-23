import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const username = searchParams.get("username");

  if (!username) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            backgroundColor: "#FAFAF8",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
            <span style={{ fontSize: 48, fontWeight: 500, color: "#1C1C19" }}>
              TRACK
            </span>
            <span style={{ fontSize: 48, fontWeight: 500, color: "#6366A0" }}>
              FLOW
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Edge runtime can't use Prisma directly, so we'll use a simpler approach
  // In production, this would call an internal API endpoint
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#FAFAF8",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "baseline", marginBottom: "40px" }}>
          <span style={{ fontSize: 20, fontWeight: 500, color: "#1C1C19" }}>
            TRACK
          </span>
          <span style={{ fontSize: 20, fontWeight: 500, color: "#6366A0" }}>
            FLOW
          </span>
        </div>

        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ fontSize: 56, fontWeight: 500, color: "#1C1C19", lineHeight: 1.1 }}>
            @{username}
          </span>
          <span style={{ fontSize: 24, color: "#6B6B64" }}>
            Developer profile on TrackFlow
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: "#6366A0",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
