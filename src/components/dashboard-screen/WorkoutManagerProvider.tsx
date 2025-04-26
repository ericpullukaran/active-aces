"use client"
import { ReactNode, useCallback, useState } from "react"
import { createTypedContext } from "~/lib/utils/context"
import { AppPage } from "../navigation/BottomNavigation"
import { useLocalStorage } from "~/lib/utils/useLocalStorage"
import { PutWorkout } from "~/lib/types/workout"
import { useUpdatedRef } from "~/lib/utils/useUpdatedRef"

export const [WorkoutManagerProvider, useWorkoutManager] = createTypedContext(
  (props: { initialPage: AppPage; children: ReactNode }) => {
    const [currentWorkout, setCurrentWorkout, removeCurrentWorkout] =
      useLocalStorage<PutWorkout | null>("current_workout", null)
    const [currentPage, setCurrentPage] = useState(currentWorkout ? "workout" : props.initialPage)
    const workoutRef = useUpdatedRef(currentWorkout)

    const startWorkout = useCallback(() => {
      if (workoutRef.current) {
        setCurrentPage("workout")
        return
      }
      setCurrentWorkout({
        name: "New Workout",
        startTime: new Date(),
        exercises: [],
      })
    }, [workoutRef, setCurrentWorkout, setCurrentPage])

    return {
      // Page navigation
      currentPage,
      setCurrentPage,

      // Workout properties
      currentWorkout,
      startWorkout,
      removeCurrentWorkout,
    }
  },
)
