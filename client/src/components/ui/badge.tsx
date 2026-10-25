import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-2.5 py-[3px] text-xs leading-4 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "border-destructive-border bg-transparent text-destructive",
        outline:
          "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        ghost: "[a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        link: "text-link underline-offset-4 [a&]:hover:underline",
        "status-todo": "bg-secondary text-secondary-foreground",
        "status-progress":
          "bg-status-progress text-status-progress-foreground",
        "status-done": "bg-status-done text-status-done-foreground",
        "priority-high": "bg-priority-high text-priority-high-foreground",
        "priority-medium": "bg-priority-medium text-priority-medium-foreground",
        "priority-low": "bg-priority-low text-priority-low-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  const showDot = !asChild && variant?.startsWith("priority-")

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {showDot && (
        <span
          data-slot="badge-dot"
          aria-hidden="true"
          className="size-1.5 rounded-full bg-current"
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
