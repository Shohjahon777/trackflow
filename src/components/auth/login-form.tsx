"use client";

import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  return (
    <div className="rounded-lg border-[0.5px] border-border bg-surface p-6">
      <Button
        onClick={() => signIn("github", { callbackUrl: "/projects" })}
        className="w-full gap-2"
      >
        <Github size={16} />
        Continue with GitHub
      </Button>
    </div>
  );
}
