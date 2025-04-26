"use client"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { createTypedContext } from "~/lib/utils/context"
import { AppPage } from "../navigation/BottomNavigation"
import { useLocalStorage } from "~/lib/utils/useLocalStorage"
import { PutWorkout } from "~/lib/types/workout"
import { useUpdatedRef } from "~/lib/utils/useUpdatedRef"
import { defaultWorkout, defaultWorkoutExercise } from "~/lib/utils/defaults"

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
      setCurrentWorkout(defaultWorkout())
    }, [workoutRef])

    const addExercise = useCallback(
      (exerciseId: string) => {
        if (!workoutRef.current) return

        setCurrentWorkout({
          ...workoutRef.current,
          exercises: [...workoutRef.current.exercises, defaultWorkoutExercise(exerciseId)],
        })
      },
      [workoutRef, setCurrentWorkout],
    )
    const deleteExercise = useCallback(
      (position: number) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          exercises: workoutRef.current.exercises.filter((_, idx) => idx !== position),
        })
      },
      [workoutRef],
    )
    const currentExercises = useMemo(() => {
      return currentWorkout?.exercises.map((exercise) => exercise) ?? []
    }, [currentWorkout])

    return {
      // Page navigation
      currentPage,
      setCurrentPage,

      // Workout properties
      currentWorkout,
      startWorkout,
      removeCurrentWorkout,

      // Exercise properties
      addExercise,
      deleteExercise,
      currentExercises,
    }
  },
)
