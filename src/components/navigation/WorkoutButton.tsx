"use client"
import React from "react"
import { motion } from "motion/react"
import { Square, Play } from "lucide-react"
import { useWorkoutManager } from "../dashboard-screen/WorkoutManagerProvider"

export const WorkoutButton = () => {
  const { currentPage, currentWorkout, setCurrentPage, startWorkout, removeCurrentWorkout } =
    useWorkoutManager()
  const isWorkoutActive = currentWorkout !== null
  const isWorkoutPage = currentPage === "workout"

  const workoutRunningInBackground = isWorkoutActive && !isWorkoutPage
  const workoutRunningInForeground = isWorkoutActive && isWorkoutPage

  const toggleWorkoutState = () => {
    if (workoutRunningInBackground) {
      // If returning to a paused workout
      setCurrentPage("workout")
    } else if (workoutRunningInForeground) {
      // Stop workout
      removeCurrentWorkout()
      setCurrentPage("home")
    } else {
      setCurrentPage("workout")
      startWorkout()
    }
  }

  const getActionButtonContent = () => {
    if (!isWorkoutActive) {
      return { text: "Start", icon: null, color: "#22c55e" }
    } else if (workoutRunningInBackground) {
      return { text: "Continue", icon: <Play size={18} />, color: "#3b82f6" }
    } else {
      return { text: "Stop", icon: <Square size={18} />, color: "#ef4444" }
    }
  }

  const buttonContent = getActionButtonContent()

  return (
    <motion.button
      layout
      onClick={toggleWorkoutState}
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
      <motion.span layout>{buttonContent.text}</motion.span>

      {/* Indicator dot for workout page */}
      {currentPage === "workout" && (
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
  )
}
