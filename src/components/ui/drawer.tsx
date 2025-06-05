"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"

import { cn } from "~/lib/utils"

// Simplified iOS detection
const isIOS = () => {
  return typeof window !== "undefined" && /iPad|iPhone|iPod/.test(window.navigator.userAgent)
}

// Track active drawers to prevent multiple scroll locks
let activeDrawerCount = 0
let restoreScroll: (() => void) | null = null

// Hook to prevent iOS input focus scrolling - inspired by Adobe React Aria
function useIOSInputFocusFix() {
  React.useEffect(() => {
    if (!isIOS()) return

    activeDrawerCount++

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement

      // Check if it's an input that will open keyboard and is in our drawer
      if (willOpenKeyboard(target) && target.closest('[data-slot="drawer-content"]')) {
        // Adobe's transform trick - much more reliable than opacity
        target.style.transform = "translateY(-2000px)"

        requestAnimationFrame(() => {
          target.style.transform = ""

          // Scroll the input into view within the drawer if needed
          scrollIntoDrawerView(target)
        })
      }
    }

    // Setup scroll prevention only for first drawer
    if (activeDrawerCount === 1) {
      restoreScroll = setupScrollPrevention()
    }

    document.addEventListener("focus", handleFocus, true)

    return () => {
      activeDrawerCount--
      document.removeEventListener("focus", handleFocus, true)

      // Restore scroll only when last drawer closes
      if (activeDrawerCount === 0 && restoreScroll) {
        restoreScroll()
        restoreScroll = null
      }
    }
  }, [])
}

// Check if element will open virtual keyboard
function willOpenKeyboard(target: Element): boolean {
  const nonTextInputTypes = new Set([
    "checkbox",
    "radio",
    "range",
    "color",
    "file",
    "image",
    "button",
    "submit",
    "reset",
  ])

  return (
    (target instanceof HTMLInputElement && !nonTextInputTypes.has(target.type)) ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  )
}

// Setup scroll prevention for iOS
function setupScrollPrevention(): () => void {
  const originalScrollY = window.pageYOffset
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

  // Store original styles
  const originalBodyStyle = document.body.style.cssText
  const originalDocumentStyle = document.documentElement.style.cssText

  // Apply scroll lock styles
  document.documentElement.style.paddingRight = `${scrollbarWidth}px`
  document.documentElement.style.overflow = "hidden"
  document.body.style.marginTop = `-${originalScrollY}px`
  document.body.style.position = "fixed"
  document.body.style.width = "100%"

  // Scroll to top
  window.scrollTo(0, 0)

  // Return restore function
  return () => {
    document.body.style.cssText = originalBodyStyle
    document.documentElement.style.cssText = originalDocumentStyle
    window.scrollTo(0, originalScrollY)
  }
}

// Scroll input into view within the drawer container
function scrollIntoDrawerView(target: Element) {
  const drawer = target.closest('[data-slot="drawer-content"]')
  if (!drawer) return

  const scrollContainer = drawer.querySelector(".overflow-scroll")
  if (scrollContainer && scrollContainer !== target) {
    const containerRect = scrollContainer.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    if (targetRect.bottom > containerRect.bottom) {
      scrollContainer.scrollTop += targetRect.bottom - containerRect.bottom + 20
    } else if (targetRect.top < containerRect.top) {
      scrollContainer.scrollTop -= containerRect.top - targetRect.top + 20
    }
  }
}

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return (
    <DrawerPrimitive.Root
      {...props}
      data-slot="drawer"
      shouldScaleBackground={shouldScaleBackground}
      onOpenChange={(open) => {
        if (!open) {
          props.onClose?.()
        }
      }}
    />
  )
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  onClose,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay> & { onClose?: () => void }) {
  return (
    <DrawerPrimitive.Overlay
      onClick={(e) => {
        e.stopPropagation()
        onClose?.()
      }}
      data-slot="drawer-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  onClose,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & { onClose?: () => void }) {
  // Apply iOS input focus fix
  useIOSInputFocusFix()

  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay onClose={onClose} />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content bg-card fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-4xl data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className,
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4 pb-10", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
