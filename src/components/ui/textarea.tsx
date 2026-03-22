import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 rounded-md border-[0.5px] border-stone bg-transparent px-3 py-2 text-[14px] text-text-body transition-colors duration-150 outline-none placeholder:text-ash focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger-bg dark:border-border dark:bg-transparent dark:placeholder:text-text-tertiary",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
