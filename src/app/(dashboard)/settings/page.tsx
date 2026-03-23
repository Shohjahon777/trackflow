import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Settings" };
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/settings/profile-form";
import { SignOutButton } from "@/components/settings/sign-out-button";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      bio: true,
      githubUsername: true,
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-[640px] space-y-8">
      <div>
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          Settings
        </h1>
        <p className="mt-1 text-[14px] text-text-secondary">
          Manage your account and profile.
        </p>
      </div>

      {/* Profile section */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Profile
        </h2>
        <div className="rounded-lg border-[0.5px] border-border bg-surface p-6">
          {/* Avatar */}
          <div className="mb-6 flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? ""}
                className="size-16 rounded-full"
              />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-accent-light text-[20px] font-medium text-accent">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div>
              <p className="text-[15px] font-medium text-text-primary">
                {user.name}
              </p>
              {user.githubUsername && (
                <p className="font-mono text-[12px] text-text-tertiary">
                  github.com/{user.githubUsername}
                </p>
              )}
            </div>
          </div>

          <ProfileForm user={user} />
        </div>
      </section>

      {/* Danger zone */}
      <section className="space-y-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Account
        </h2>
        <div className="flex items-center justify-between rounded-lg border-[0.5px] border-border bg-surface p-6">
          <div>
            <p className="text-[14px] font-medium text-text-primary">
              Sign out
            </p>
            <p className="text-[12px] text-text-secondary">
              Sign out of your TrackFlow account.
            </p>
          </div>
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
