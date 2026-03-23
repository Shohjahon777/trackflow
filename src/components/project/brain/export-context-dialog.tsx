"use client";

import { useState, useTransition } from "react";
import {
  Download,
  Copy,
  Check,
  FileText,
  FileCode,
  File,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generateContext } from "@/actions/ai-context";

type ExportContextDialogProps = {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ExportFormat = "markdown" | "plaintext" | "cursorrules";

const formats: { id: ExportFormat; label: string; icon: typeof FileText; ext: string }[] = [
  { id: "markdown", label: "Markdown", icon: FileText, ext: ".md" },
  { id: "plaintext", label: "Plain text", icon: File, ext: ".txt" },
  { id: "cursorrules", label: ".cursorrules", icon: FileCode, ext: ".cursorrules" },
];

export function ExportContextDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: ExportContextDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("markdown");
  const [result, setResult] = useState<{ content: string; tokenEstimate: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateContext(projectId, format);
      if ("content" in res && res.content) {
        setResult({ content: res.content, tokenEstimate: res.tokenEstimate ?? 0 });
      }
    });
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = formats.find((f) => f.id === format)?.ext ?? ".md";
    const blob = new Blob([result.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}-context${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[16px]">
            <Sparkles size={18} className="text-accent" />
            Export as context
          </DialogTitle>
          <p className="text-[13px] text-text-secondary">
            Export your brain notes as structured context for Cursor, Claude Code, or other AI tools.
          </p>
        </DialogHeader>

        {/* Format selector */}
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
            Format
          </p>
          <div className="mt-2 flex gap-2">
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFormat(f.id);
                  setResult(null);
                }}
                className={`flex items-center gap-2 rounded-md border-[0.5px] px-3 py-2 text-[13px] transition-colors ${
                  format === f.id
                    ? "border-accent/40 bg-accent-light text-accent"
                    : "border-border text-text-secondary hover:border-accent/20"
                }`}
              >
                <f.icon size={14} strokeWidth={1.5} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        {!result && (
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="mt-4 w-full gap-1.5"
          >
            {isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Sparkles size={14} />
            )}
            Generate context
          </Button>
        )}

        {/* Result preview */}
        {result && (
          <>
            <div className="mt-4 max-h-[280px] overflow-y-auto rounded-md border-[0.5px] border-border bg-surface p-3">
              <pre className="whitespace-pre-wrap font-mono text-[12px] text-text-secondary">
                {result.content.slice(0, 2000)}
                {result.content.length > 2000 && "\n\n... (truncated in preview)"}
              </pre>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[11px] text-text-tertiary">
                ~{result.tokenEstimate.toLocaleString()} tokens
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download size={14} />
                  Download
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
