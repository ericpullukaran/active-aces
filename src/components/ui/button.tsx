"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "ring-offset-background focus-visible:ring-ring relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground enabled:hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90",
        outline:
          "border-input bg-card enabled:hover:bg-accent enabled:hover:text-accent-foreground border",
        destructiveOutline:
          "border-input bg-card enabled:hover:bg-accent enabled:hover:text-accent-foreground text-destructive border-destructive border",
        secondary: "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80",
        tertiary: "bg-white text-zinc-800 enabled:hover:bg-zinc-100",
        ghost: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 enabled:hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-xl px-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
      },
      /**
       * Note: separated so disabled styles don't affect the loading state
       */
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  },
)

// Helper function to get loading overlay background based on variant
const getLoadingOverlayBg = (variant: string | null | undefined = "default") => {
  switch (variant) {
    case "default":
      return "bg-primary/80"
    case "destructive":
      return "bg-destructive/80"
    case "destructiveOutline":
      return "bg-destructive/80"
    case "outline":
      return "bg-accent/80"
    case "secondary":
      return "bg-secondary/80"
    case "tertiary":
      return "bg-zinc-100/80"
    case "ghost":
      return "bg-accent/80"
    default:
      return "bg-primary/80"
  }
}

// Helper function to get loading text color based on variant
const getLoadingTextColor = (variant: string | null | undefined = "default") => {
  switch (variant) {
    case "default":
      return "text-primary-foreground"
    case "destructive":
      return "text-destructive-foreground"
    case "destructiveOutline":
      return "text-white"
    case "outline":
      return "text-accent-foreground"
    case "secondary":
      return "text-secondary-foreground"
    case "tertiary":
      return "text-zinc-800"
    case "ghost":
      return "text-accent-foreground"
    default:
      return "text-primary-foreground"
  }
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "disabled"> {
  asChild?: boolean
  isLoading?: boolean
  scalingOnClick?: boolean
  Icon?: React.ComponentType<{ className?: string }>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      scalingOnClick = !asChild,
      Icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"

    const isContentTooShort = React.useMemo(() => {
      if (typeof children === "string") {
        return children.length <= 7 // If text is 6 characters or less, only show spinner
      }
      return false
    }, [children])

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, disabled: props.disabled }), className, {
          "focus-visible:shadow-focus-ring-button focus:scale-[0.98] enabled:active:scale-[0.97]":
            scalingOnClick,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {Icon ? <Icon className="h-5 w-5" /> : null}

        <Slottable>{children}</Slottable>

        {/* Loading Overlay */}
        {variant !== "link" && (
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-2 rounded-xl backdrop-blur-sm",
                  getLoadingOverlayBg(variant),
                  getLoadingTextColor(variant),
                )}
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                {size !== "icon" && size !== "icon-sm" && !isContentTooShort && (
                  <span className="text-sm font-medium">Loading</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
