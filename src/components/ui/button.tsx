"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-[14px] font-medium whitespace-nowrap transition-all duration-150 ease-in-out outline-none select-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:border-accent active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* BRANDBOOK §5.3 */
        default: "bg-accent text-cloud hover:bg-accent-hover",
        secondary:
          "border-stone bg-transparent text-charcoal hover:bg-fog dark:border-border dark:text-text-body dark:hover:bg-surface-hover",
        ghost:
          "text-accent hover:underline",
        destructive:
          "border-danger bg-transparent text-danger hover:bg-danger-bg",
        outline:
          "border-border bg-background text-text-body hover:bg-surface-hover",
        link: "text-accent underline-offset-4 hover:underline",
      },
      size: {
        default: "h-[36px] gap-2 px-4",
        sm: "h-[30px] gap-1.5 px-3 text-[12px]",
        lg: "h-[40px] gap-2 px-5",
        icon: "size-[36px]",
        "icon-sm": "size-[30px]",
        "icon-xs": "size-[24px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
