"use client";

import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import { Eye, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

marked.setOptions({ breaks: true });

type MarkdownEditorProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export function MarkdownEditor({
  name,
  defaultValue = "",
  placeholder = "Write with **markdown** supported...",
  rows = 12,
  required,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (mode === "preview") {
      setPreview(marked.parse(value || "_Nothing to preview_") as string);
    }
  }, [mode, value]);

  return (
    <div className="flex flex-col gap-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between rounded-t-md border-x-[0.5px] border-t-[0.5px] border-border bg-surface px-3 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Markdown
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors",
              mode === "write"
                ? "bg-accent-light text-accent"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <Pencil size={11} strokeWidth={1.5} />
            Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={cn(
              "flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors",
              mode === "preview"
                ? "bg-accent-light text-accent"
                : "text-text-tertiary hover:text-text-secondary"
            )}
          >
            <Eye size={11} strokeWidth={1.5} />
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {mode === "write" ? (
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className="w-full resize-none rounded-b-md border-[0.5px] border-border bg-background px-3 py-2.5 font-mono text-[13px] leading-[1.6] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent/40"
        />
      ) : (
        <>
          {/* hidden input keeps value in form when in preview mode */}
          <input type="hidden" name={name} value={value} />
          <div
            className={cn(
              "min-h-0 w-full overflow-y-auto rounded-b-md border-[0.5px] border-border bg-background px-4 py-3",
              "prose prose-sm max-w-none",
              // Override prose colors to match brandbook
              "[&_h1]:text-[18px] [&_h1]:font-medium [&_h1]:text-text-primary",
              "[&_h2]:text-[15px] [&_h2]:font-medium [&_h2]:text-text-primary",
              "[&_h3]:text-[14px] [&_h3]:font-medium [&_h3]:text-text-primary",
              "[&_p]:text-[14px] [&_p]:leading-[1.7] [&_p]:text-text-primary",
              "[&_li]:text-[14px] [&_li]:leading-[1.7] [&_li]:text-text-primary",
              "[&_code]:rounded [&_code]:bg-surface [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[12px] [&_code]:text-text-primary",
              "[&_pre]:rounded-md [&_pre]:border-[0.5px] [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-3",
              "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
              "[&_blockquote]:border-l-2 [&_blockquote]:border-accent [&_blockquote]:pl-3 [&_blockquote]:text-text-secondary",
              "[&_a]:text-accent [&_a]:no-underline hover:[&_a]:underline",
              "[&_strong]:font-medium [&_strong]:text-text-primary",
              "[&_hr]:border-border"
            )}
            style={{ minHeight: `${rows * 1.6 * 13}px` }}
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </>
      )}
    </div>
  );
}
