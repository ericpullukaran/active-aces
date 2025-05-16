"use client"
import React from "react"
import { motion } from "motion/react"
import { Database, PlusCircleIcon, SquarePlus } from "lucide-react"
import { useWorkoutManager } from "../dashboard-screen/WorkoutManagerProvider"
import { AddExerciseDialog } from "../AddExerciseDialog"

export const ExercisesButton = () => {
  const { currentPage, currentWorkout, setCurrentPage } = useWorkoutManager()
  const isWorkoutActive = currentWorkout !== null
  const isWorkoutPage = currentPage === "workout"
  const isExercisesPage = currentPage === "exercises"

  const showAddExerciseIcon = isWorkoutActive && isWorkoutPage

  return (
    <AddExerciseDialog>
      {({ openDialog }) => (
        <motion.button
          layout
          className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
          onClick={() => {
            if (!isWorkoutActive || (isWorkoutActive && !isWorkoutPage)) {
              setCurrentPage("exercises")
            } else {
              openDialog()
            }
          }}
        >
          <motion.div
            animate={{ rotate: showAddExerciseIcon ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {showAddExerciseIcon ? (
              <PlusCircleIcon size={24} color={"#9ca3af"} />
            ) : (
              <Database size={24} color={isExercisesPage ? "#ffffff" : "#9ca3af"} />
            )}
          </motion.div>
          {isExercisesPage && (
            <motion.div
              className="absolute -bottom-2 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
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
    </AddExerciseDialog>
  )
}
