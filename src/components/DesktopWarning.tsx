"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { MOBILE_VIEWPORT_WIDTH } from "~/lib/utils"

export function DesktopWarning() {
  const [isDesktop, setIsDesktop] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkIfDesktop = () => {
      const isLargeScreen = window.innerWidth >= MOBILE_VIEWPORT_WIDTH
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      const userAgent = navigator.userAgent.toLowerCase()

      // Check for desktop OS indicators
      const isDesktopOS =
        userAgent.includes("windows") ||
        userAgent.includes("macintosh") ||
        (userAgent.includes("linux") && !userAgent.includes("android"))

      // Consider it desktop if it's a large screen without touch OR has desktop OS
      const desktop = (isLargeScreen && !isTouchDevice) || isDesktopOS

      setIsDesktop(desktop)
      setShowWarning(desktop)
    }

    // Check on mount
    checkIfDesktop()

    // Check on resize
    window.addEventListener("resize", checkIfDesktop)

    return () => {
      window.removeEventListener("resize", checkIfDesktop)
    }
  }, [])

  if (!isDesktop) return null

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Desktop Not Supported</DialogTitle>
          <DialogDescription className="space-y-4 text-sm">
            Active Aces is designed specifically for mobile devices to provide the best workout
            tracking experience.
            <br />
            <br />
            For the optimal experience, please access this app on your phone or tablet.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row justify-end">
          <Button
            variant="destructiveOutline"
            onClick={() => setShowWarning(false)}
            className="sm:order-1"
          >
            Continue Anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
