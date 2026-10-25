import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import { Slot } from "radix-ui"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border whitespace-nowrap no-underline transition-all outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground",
        secondary:
          "border-transparent bg-secondary font-semibold text-secondary-foreground disabled:opacity-50",
        outline:
          "border-input bg-transparent font-medium text-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        ghost:
          "border-transparent bg-transparent font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
        "ghost-destructive":
          "border-transparent bg-transparent font-medium text-destructive disabled:opacity-50",
        destructive:
          "border-destructive-border bg-transparent font-medium text-destructive disabled:opacity-50",
        link: "border-transparent bg-transparent font-medium text-link underline-offset-4 hover:underline disabled:opacity-50",
      },
      size: {
        default: "h-[46px] rounded-md px-[22px] text-[15px]",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 rounded-[10px] px-3.5 text-sm",
        lg: "h-10 rounded-md px-6 text-sm",
        icon: "h-10 w-10 rounded-md p-0 text-[15px]",
        "icon-xs": "size-6 rounded-md p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "h-9 w-9 rounded-[10px] p-0 text-sm",
        "icon-lg": "size-10 rounded-md p-0 text-[15px]",
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
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
