import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/overview");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[360px] space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-mono text-[24px] font-medium text-text-primary">
            TRACK<span className="text-accent">FLOW</span>
          </h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            Sign in to your command center.
          </p>
        </div>

        {/* Sign in card */}
        <LoginForm />

        {/* Footer */}
        <p className="text-center text-[12px] text-text-tertiary">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
