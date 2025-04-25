"use client"
import React from "react"
import { motion, LayoutGroup } from "motion/react"
import { Home, Clock, ListOrdered, User, Square, Plus, Play } from "lucide-react"
import { useWorkoutManager } from "./workout-manager/WorkoutManagerProvider"
import AuthButton from "./AuthButton"
import { cn } from "~/lib/utils"

export type AppPage = "home" | "history" | "workout" | "exercises"

const BottomNavigation = () => {
  const { currentPage, currentWorkout, setCurrentPage, startWorkout, removeCurrentWorkout } =
    useWorkoutManager()
  const isWorkoutActive = currentWorkout !== null

  const toggleWorkoutState = () => {
    if (isWorkoutActive && currentPage !== "workout") {
      // If returning to a paused workout
      setCurrentPage("workout")
    } else if (isWorkoutActive && currentPage === "workout") {
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
    } else if (isWorkoutActive && currentPage !== "workout") {
      return { text: "Continue", icon: <Play size={18} />, color: "#3b82f6" }
    } else {
      return { text: "Stop", icon: <Square size={18} />, color: "#ef4444" }
    }
  }

  const buttonContent = getActionButtonContent()

  return (
    <div className="absolute inset-x-0 bottom-6 mx-3 flex flex-col items-center gap-8">
      <motion.div
        layout
        className="bg-card relative flex w-full max-w-lg items-center justify-between overflow-hidden rounded-full px-3 py-1 text-gray-300 backdrop-blur-md"
      >
        <LayoutGroup>
          {/* Home Button */}
          <NavButton
            Icon={Home}
            page="home"
            currentPage={currentPage}
            onClick={() => setCurrentPage("home")}
          />

          {/* History Button */}
          <NavButton
            Icon={Clock}
            page="history"
            currentPage={currentPage}
            onClick={() => setCurrentPage("history")}
          />

          {/* Dynamic Middle Button */}
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
                layoutId="activeIndicator"
              />
            )}
          </motion.button>

          {/* Exercises/Add Exercise Button */}
          <motion.button
            layout
            className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
            onClick={() => !isWorkoutActive && setCurrentPage("exercises")}
          >
            <motion.div
              animate={{ rotate: isWorkoutActive ? 135 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isWorkoutActive ? (
                <Plus size={24} color={currentPage === "exercises" ? "#ffffff" : "#9ca3af"} />
              ) : (
                <ListOrdered
                  size={24}
                  color={currentPage === "exercises" ? "#ffffff" : "#9ca3af"}
                />
              )}
            </motion.div>
            {!isWorkoutActive && currentPage === "exercises" && (
              <motion.div
                className="absolute -bottom-2 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
                layoutId="activeIndicator"
              />
            )}
          </motion.button>

          {/* Profile Button */}
          <motion.button
            layout
            className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
          >
            <AuthButton />
          </motion.button>
        </LayoutGroup>
      </motion.div>
    </div>
  )
}

const NavButton = ({
  Icon,
  page,
  currentPage,
  onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>
  page: AppPage
  currentPage: AppPage
  onClick: () => void
}) => {
  return (
    <motion.button
      layout
      className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
      onClick={onClick}
    >
      <Icon className={cn(currentPage === page ? "text-white" : "text-gray-400")} />
      {currentPage === page && (
        <motion.div
          className="absolute -bottom-2 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  )
}

export default BottomNavigation
