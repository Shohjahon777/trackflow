"use client";

import { useTransition, useOptimistic } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleProfileVisibility } from "@/actions/project";

type Props = {
  projectId: string;
  showOnProfile: boolean;
};

export function ProfileVisibilityToggle({ projectId, showOnProfile }: Props) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(showOnProfile);

  function handleToggle() {
    startTransition(async () => {
      setOptimistic(!optimistic);
      await toggleProfileVisibility(projectId);
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] transition-colors hover:bg-surface-hover"
      title={optimistic ? "Visible on public profile — click to hide" : "Hidden from public profile — click to show"}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin text-text-tertiary" strokeWidth={1.5} />
      ) : optimistic ? (
        <Eye size={13} className="text-accent" strokeWidth={1.5} />
      ) : (
        <EyeOff size={13} className="text-text-tertiary" strokeWidth={1.5} />
      )}
      <span className={optimistic ? "text-accent" : "text-text-tertiary"}>
        {optimistic ? "On profile" : "Hidden"}
      </span>
    </button>
  );
}
