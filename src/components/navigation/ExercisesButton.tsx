"use client"
import React from "react"
import { motion } from "motion/react"
import { Database, PlusCircleIcon } from "lucide-react"
import { AddExerciseDialog } from "../AddExerciseDialog"
import { useSnapshot } from "valtio"
import { navigationActions, navigationStore } from "~/lib/stores/navigationStore"
import { useIsWorkoutActive } from "~/lib/utils/useIsWorkoutActive"

export const ExercisesButton = () => {
  const observableNavigation = useSnapshot(navigationStore)
  const isWorkoutActive = useIsWorkoutActive()
  const isWorkoutPage = observableNavigation.currentPage === "workout"
  const isExercisesPage = observableNavigation.currentPage === "exercises"

  const showAddExerciseIcon = isWorkoutActive && isWorkoutPage

  return (
    <AddExerciseDialog>
      {({ openDialog }) => (
        <motion.button
          layout
          style={{ originY: "top" }}
          className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
          onClick={() => {
            if (!isWorkoutActive || (isWorkoutActive && !isWorkoutPage)) {
              navigationActions.setCurrentPage("exercises")
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
