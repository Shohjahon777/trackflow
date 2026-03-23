"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type ProfileFormProps = {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-text-secondary">
          Display name
        </label>
        <Input
          name="name"
          defaultValue={user.name ?? ""}
          placeholder="Your name"
        />
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-text-secondary">
          Username
        </label>
        <div className="flex items-center gap-0">
          <span className="flex h-[36px] items-center rounded-l-md border-[0.5px] border-r-0 border-stone bg-fog px-3 text-[13px] text-text-tertiary dark:border-border dark:bg-surface-hover">
            trackflow.dev/
          </span>
          <Input
            name="username"
            defaultValue={user.username ?? ""}
            placeholder="username"
            className="rounded-l-none font-mono"
          />
        </div>
        <p className="text-[11px] text-text-tertiary">
          This is your public profile URL.
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-text-secondary">
          Bio
        </label>
        <Textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          placeholder="A short bio about yourself..."
          rows={3}
        />
      </div>

      {/* Error / Success */}
      {error && (
        <p className="text-[13px] text-danger">{error}</p>
      )}
      {success && (
        <p className="text-[13px] text-success">Profile updated.</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
