import { redirect } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/plan";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userIsPro = await isPro(session.user.id);

  return (
    <TooltipProvider delay={300}>
      <DashboardShell user={session.user} isPro={userIsPro}>
        {children}
      </DashboardShell>
    </TooltipProvider>
  );
}
