import type { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Profile" };
import { db } from "@/lib/db";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function ProfilePage() {
  let user = null;

  try {
    const session = await auth();
    if (session?.user?.id) {
      user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          username: true,
          bio: true,
          image: true,
          githubUsername: true,
        },
      });
    }
  } catch {
    // Auth not configured
  }

  return (
    <div className="mx-auto max-w-[640px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
            Profile
          </h1>
          <p className="mt-1 text-[14px] text-text-secondary">
            Manage your public developer profile.
          </p>
        </div>
        {user?.username && (
          <Link href={`/${user.username}`} target="_blank">
            <Button variant="secondary" size="sm">
              <ExternalLink size={14} />
              View public profile
            </Button>
          </Link>
        )}
      </div>

      {/* Preview */}
      {user?.username && (
        <div className="rounded-md border-[0.5px] border-border bg-surface p-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Your profile URL
          </span>
          <p className="mt-1 font-mono text-[14px] text-accent">
            trackflow.dev/{user.username}
          </p>
        </div>
      )}

      {/* Edit form */}
      <div className="rounded-md border-[0.5px] border-border p-6">
        {user ? (
          <ProfileForm
            user={{
              name: user.name,
              username: user.username,
              bio: user.bio,
            }}
          />
        ) : (
          <p className="text-[14px] text-text-secondary">
            Sign in to manage your profile.
          </p>
        )}
      </div>
    </div>
  );
}
