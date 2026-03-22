import { FileText } from "lucide-react";

type NoteCardProps = {
  note: {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
  };
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <div className="group flex flex-col gap-2 rounded-md border-[0.5px] border-border bg-background p-4 transition-colors duration-[120ms] hover:border-accent-muted">
      <div className="flex items-center gap-2">
        <div className="flex size-[28px] shrink-0 items-center justify-center rounded-md bg-fog dark:bg-surface-hover">
          <FileText size={14} className="text-slate" strokeWidth={1.5} />
        </div>
        <h3 className="truncate text-[14px] font-medium text-text-primary">
          {note.title}
        </h3>
      </div>

      <p className="line-clamp-3 text-[13px] leading-[1.6] text-text-secondary">
        {note.content}
      </p>

      <div className="flex items-center justify-end">
        <span className="font-mono text-[11px] text-text-tertiary">
          {note.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
