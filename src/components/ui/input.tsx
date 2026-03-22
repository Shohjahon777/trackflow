import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-[36px] w-full min-w-0 rounded-md border-[0.5px] border-stone bg-transparent px-3 text-[14px] text-text-body transition-colors duration-150 outline-none placeholder:text-ash focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent-light disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-[3px] aria-invalid:ring-danger-bg dark:border-border dark:bg-transparent dark:placeholder:text-text-tertiary",
        className
      )}
      {...props}
    />
  )
}

export { Input }
