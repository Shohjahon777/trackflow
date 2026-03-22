import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const session = await auth();
    user = session?.user ?? null;
  } catch {
    // Auth not configured yet
  }

  return (
    <TooltipProvider delayDuration={300}>
      <DashboardShell user={user}>{children}</DashboardShell>
    </TooltipProvider>
  );
}
