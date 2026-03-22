import { NextRequest, NextResponse } from "next/server";

// Paths that require authentication
const protectedPaths = [
  "/projects",
  "/brain",
  "/activity",
  "/shares",
  "/time-log",
  "/profile",
  "/settings",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files
  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Allow all API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check if this is a protected path
  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isProtected) {
    // Public: landing, login, share links, username profiles, etc.
    return NextResponse.next();
  }

  // Protected path — check for session
  const token =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
