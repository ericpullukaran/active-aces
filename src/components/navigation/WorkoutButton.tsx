"use client"
import React from "react"
import { motion } from "motion/react"
import { Square, Play, Loader2 } from "lucide-react"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation } from "@tanstack/react-query"
import EndWorkoutDialog from "../EndWorkoutDialog"
import { TextMorph } from "../ui/text-morph"
import { workoutActions } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"
import { navigationActions, navigationStore } from "~/lib/stores/navigationStore"
import { useIsWorkoutActive } from "~/lib/utils/useIsWorkoutActive"
import { trackWorkout } from "~/lib/utils/analytics"

export const WorkoutButton = () => {
  const trpc = useTRPC()
  const putWorkoutMutation = useMutation(trpc.workouts.put.mutationOptions())
  const observableNavigation = useSnapshot(navigationStore)
  const isWorkoutActive = useIsWorkoutActive()
  const isWorkoutPage = observableNavigation.currentPage === "workout"

  const workoutRunningInBackground = isWorkoutActive && !isWorkoutPage
  const workoutRunningInForeground = isWorkoutActive && isWorkoutPage

  const toggleWorkoutState = (openDialog: () => void) => {
    if (workoutRunningInBackground) {
      // If returning to a paused workout
      navigationActions.setCurrentPage("workout")
    } else if (workoutRunningInForeground) {
      // Stop workout
      openDialog()
    } else {
      navigationActions.setCurrentPage("workout")
      workoutActions.startWorkout()

      trackWorkout.started({
        timestamp: new Date(),
      })
    }
  }

  const getActionButtonContent = () => {
    if (!isWorkoutActive) {
      return { text: "Start", icon: null, color: "#22c55e" }
    } else if (workoutRunningInBackground) {
      return { text: "Continue", icon: <Play size={18} />, color: "#3b82f6" }
    } else {
      return {
        text: putWorkoutMutation.isPending ? "Saving..." : "Stop",
        icon: putWorkoutMutation.isPending ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Square size={18} />
        ),
        color: "#ef4444",
      }
    }
  }

  const buttonContent = getActionButtonContent()

  return (
    <EndWorkoutDialog>
      {({ openDialog }) => (
        <motion.button
          layout
          style={{ originY: "top" }}
          onClick={() => toggleWorkoutState(openDialog)}
          className="relative flex h-10 min-w-24 items-center justify-center gap-1 rounded-full px-6 py-2 font-bold text-white"
          animate={{
            backgroundColor: buttonContent.color,
          }}
          transition={{ duration: 0.3 }}
        >
          {buttonContent.icon && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {buttonContent.icon}
            </motion.div>
          )}
          <TextMorph>{buttonContent.text}</TextMorph>

          {/* Indicator dot for workout page */}
          {observableNavigation.currentPage === "workout" && (
            <motion.div
              className="absolute -bottom-4 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
              transition={{
                type: "spring",
                ease: "easeOut",
                duration: 0.5,
                bounce: 0.3,
              }}
              layoutId="activeIndicator"
            />
          )}
        </motion.button>
      )}
    </EndWorkoutDialog>
  )
}
