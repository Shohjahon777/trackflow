import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border-[0.5px] border-dashed border-border py-12 px-4 text-center">
      <Icon size={24} className="mb-3 text-text-tertiary" />
      <h3 className="text-[15px] font-medium text-text-primary">{title}</h3>
      <p className="mt-1 max-w-xs text-[14px] text-text-secondary">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
