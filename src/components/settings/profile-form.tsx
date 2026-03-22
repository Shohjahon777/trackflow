"use client";

import { useActionState } from "react";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfileFormProps = {
  user: {
    name: string | null;
    username: string | null;
    bio: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      return await updateProfile(formData);
    },
    {}
  );

  return (
    <form action={action} className="space-y-4">
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
        <textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          placeholder="A short bio about yourself..."
          rows={3}
          className="w-full resize-none rounded-md border-[0.5px] border-stone bg-transparent px-3 py-2 text-[14px] text-text-body transition-colors duration-150 outline-none placeholder:text-ash focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light dark:border-border dark:placeholder:text-text-tertiary"
        />
      </div>

      {/* Error / Success */}
      {state.error && (
        <p className="text-[13px] text-danger">{state.error}</p>
      )}
      {state.success && (
        <p className="text-[13px] text-success">Profile updated.</p>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
