import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Get the current session. Redirects to /login if not authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

/**
 * Get the current session without redirecting. Returns null if not authenticated.
 */
export async function getSession() {
  return await auth();
}
