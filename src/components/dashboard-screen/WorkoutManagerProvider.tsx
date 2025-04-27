"use client"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { createTypedContext } from "~/lib/utils/context"
import { AppPage } from "../navigation/BottomNavigation"
import { useLocalStorage } from "~/lib/utils/useLocalStorage"
import { ExerciseSet, PutWorkout, WorkoutExercise } from "~/lib/types/workout"
import { useUpdatedRef } from "~/lib/utils/useUpdatedRef"
import { defaultExerciseSet, defaultWorkout, defaultWorkoutExercise } from "~/lib/utils/defaults"

export const [WorkoutManagerProvider, useWorkoutManager] = createTypedContext(
  (props: { initialPage: AppPage; children: ReactNode }) => {
    const [currentWorkout, setCurrentWorkout, removeCurrentWorkout] =
      useLocalStorage<PutWorkout | null>("current_workout", null)
    const [currentPage, setCurrentPage] = useState(currentWorkout ? "workout" : props.initialPage)
    const workoutRef = useUpdatedRef(currentWorkout)

    const addWorkoutNote = useCallback(
      (note: string) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          notes: note,
        })
      },
      [workoutRef],
    )
    const startWorkout = useCallback(() => {
      if (workoutRef.current) {
        setCurrentPage("workout")
        return
      }
      setCurrentWorkout(defaultWorkout())
    }, [workoutRef])

    const updateExerciseSettings = useCallback(
      (
        stableExerciseId: string,
        opts: {
          enableAssistedReps?: boolean
          notes?: string
        },
      ) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          exercises: workoutRef.current.exercises.map((exercise) =>
            exercise.stableExerciseId === stableExerciseId
              ? {
                  ...exercise,
                  // Update assisted reps toggle if provided
                  ...(opts.enableAssistedReps !== undefined && {
                    enableAssistedReps: opts.enableAssistedReps,
                  }),
                  ...(opts.notes !== undefined && {
                    notes: opts.notes,
                  }),
                }
              : exercise,
          ),
        })
      },
      [workoutRef],
    )
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
      (stableExerciseId: string) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          exercises: workoutRef.current.exercises.filter(
            (exercise) => exercise.stableExerciseId !== stableExerciseId,
          ),
        })
      },
      [workoutRef],
    )
    const currentExercises = useMemo(() => {
      return currentWorkout?.exercises.map((exercise) => exercise) ?? []
    }, [currentWorkout])

    const addSet = useCallback(
      (stableExerciseId: string) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          exercises: workoutRef.current.exercises.map((exercise) =>
            exercise.stableExerciseId === stableExerciseId
              ? { ...exercise, sets: [...exercise.sets, defaultExerciseSet()] }
              : exercise,
          ),
        })
      },
      [workoutRef],
    )
    const updateSet = useCallback(
      (stableExerciseId: string, stableSetId: string, setUpdate: Partial<ExerciseSet>) => {
        const workout = workoutRef.current
        if (!workout) return
        setCurrentWorkout({
          ...workout,
          exercises: workout.exercises.map((exercise) =>
            exercise.stableExerciseId === stableExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map((set) =>
                    set.stableSetId === stableSetId ? { ...set, ...setUpdate } : set,
                  ),
                }
              : exercise,
          ),
        })
      },
      [workoutRef],
    )
    const removeSet = useCallback(
      (stableExerciseId: string, stableSetId: string) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          exercises: workoutRef.current.exercises.map((exercise) =>
            exercise.stableExerciseId === stableExerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.filter((set) => set.stableSetId !== stableSetId),
                }
              : exercise,
          ),
        })
      },
      [workoutRef],
    )
    return {
      // Page navigation
      currentPage,
      setCurrentPage,

      // Workout properties
      addWorkoutNote,
      removeCurrentWorkout,
      currentWorkout,
      startWorkout,

      // Exercise properties
      addExercise,
      deleteExercise,
      currentExercises,
      updateExerciseSettings,

      // Set properties
      addSet,
      updateSet,
      removeSet,
    }
  },
)
