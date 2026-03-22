"use client";

import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="destructive" size="sm">
        <LogOut size={14} />
        Sign out
      </Button>
    </form>
  );
}
