"use client";

import { useEffect } from "react";

/**
 * Lightweight analytics tracker for public profile pages.
 * Sends a single POST to /api/analytics on mount.
 */
export function ProfileTracker({ userId }: { userId: string }) {
  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "profile_view",
        userId,
        referrer: document.referrer || null,
        path: window.location.pathname,
      }),
    }).catch(() => {}); // Silently fail
  }, [userId]);

  return null;
}
