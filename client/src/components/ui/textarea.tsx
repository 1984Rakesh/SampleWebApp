import * as React from "react"
import { cn } from "./utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-input bg-inset px-3.5 py-3 text-[15px] leading-[22px] text-foreground transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring read-only:border-border read-only:bg-muted read-only:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
