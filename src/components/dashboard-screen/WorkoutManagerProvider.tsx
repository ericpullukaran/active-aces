"use client"
import { type ReactNode, useCallback, useMemo, useState, useRef, useEffect } from "react"
import { createTypedContext } from "~/lib/utils/context"
import { type AppPage } from "../navigation/BottomNavigation"
import { useLocalStorage } from "~/lib/utils/useLocalStorage"
import { type WorkoutHistoryExercise, type ExerciseSet, type PutWorkout } from "~/lib/types/workout"
import { useUpdatedRef } from "~/lib/utils/useUpdatedRef"
import { defaultExerciseSet, defaultWorkout, defaultWorkoutExercise } from "~/lib/utils/defaults"

export const [WorkoutManagerProvider, useWorkoutManager] = createTypedContext(
  (props: { initialPage: AppPage; children: ReactNode }) => {
    const [currentWorkout, setCurrentWorkout, removeCurrentWorkout] =
      useLocalStorage<PutWorkout | null>("current_workout", null)
    const [currentPage, setCurrentPage] = useState(currentWorkout ? "workout" : props.initialPage)
    const workoutRef = useUpdatedRef(currentWorkout)
    // Ref to store the current elapsed time of the stopwatch
    const currentStopwatchElapsedTimeRef = useRef<number>(0)

    const addWorkoutNote = useCallback(
      (note: string) => {
        if (!workoutRef.current) return
        setCurrentWorkout({
          ...workoutRef.current,
          notes: note,
        })
      },
      [setCurrentWorkout, workoutRef],
    )
    const startWorkout = useCallback(() => {
      if (workoutRef.current) {
        setCurrentPage("workout")
        return
      }
      setCurrentWorkout(defaultWorkout())
    }, [setCurrentWorkout, workoutRef])
    const forceCopyWorkout = useCallback(
      (workout: WorkoutHistoryExercise) => {
        setCurrentWorkout({
          ...defaultWorkout(),
          exercises: workout.workoutExercises.map((we) => ({
            ...defaultWorkoutExercise(we.exercise.id),
            ...we,
            notes: we.notes ?? undefined,
            sets: we.sets.map((set) => ({
              ...defaultExerciseSet(),
              order: set.order,
              weight: set.weight ?? undefined,
              reps: set.reps ?? undefined,
              assistedReps: set.assistedReps ?? undefined,
              distance: set.distance ?? undefined,
              time: set.time ?? undefined,
              completed: false,
              completedAt: undefined,
            })),
          })),
        })
        setCurrentPage("workout")
      },
      [setCurrentWorkout],
    )
    const maybeCopyWorkout = useCallback(
      (workout: WorkoutHistoryExercise) => {
        if (workoutRef.current) {
          return false
        } else {
          forceCopyWorkout(workout)
          return true
        }
      },
      [forceCopyWorkout, workoutRef],
    )

    const updateExerciseSettings = useCallback(
      (
        stableExerciseId: string,
        opts: {
          enableAssistedReps?: boolean
          enableWeightedReps?: boolean
          notes?: string
          restTimeSeconds?: number
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
                  ...(opts.enableWeightedReps !== undefined && {
                    enableWeightedReps: opts.enableWeightedReps,
                  }),
                  ...(opts.notes !== undefined && {
                    notes: opts.notes,
                  }),
                  ...(opts.restTimeSeconds !== undefined && {
                    restTimeMs: opts.restTimeSeconds * 1000,
                  }),
                }
              : exercise,
          ),
        })
      },
      [setCurrentWorkout, workoutRef],
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
      [setCurrentWorkout, workoutRef],
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
      [setCurrentWorkout, workoutRef],
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
      [setCurrentWorkout, workoutRef],
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
      [setCurrentWorkout, workoutRef],
    )

    const [timerDurationSeconds, setTimerDurationSeconds] = useState({
      setId: "",
      duration: 0,
    })

    const [activeStopwatchSetInfo, setActiveStopwatchSetInfo] = useState<{
      exerciseId: string
      setId: string
      initialSeconds?: number
    } | null>(null)

    // This function gets called from StopwatchBar to update the current elapsed time
    const updateStopwatchElapsedTime = useCallback((time: number) => {
      currentStopwatchElapsedTimeRef.current = time
    }, [])
    const stopStopwatch = useCallback(
      (elapsedSeconds?: number) => {
        if (activeStopwatchSetInfo && elapsedSeconds !== undefined) {
          updateSet(activeStopwatchSetInfo.exerciseId, activeStopwatchSetInfo.setId, {
            time: elapsedSeconds,
          })
        }
        setActiveStopwatchSetInfo(null)
      },
      [activeStopwatchSetInfo, updateSet],
    )
    const startStopwatch = useCallback(
      (props: { exerciseId: string; setId: string; initialSeconds?: number }) => {
        // If there's an active stopwatch, stop it and save its progress
        if (activeStopwatchSetInfo) {
          stopStopwatch(currentStopwatchElapsedTimeRef.current)
          currentStopwatchElapsedTimeRef.current = 0
        }

        setActiveStopwatchSetInfo({
          exerciseId: props.exerciseId,
          setId: props.setId,
          initialSeconds: props.initialSeconds,
        })
      },
      [activeStopwatchSetInfo, stopStopwatch],
    )
    // This effect checks if the set that the stopwatch is tied to still exists
    // or if it has been completed. If so, it stops the stopwatch
    useEffect(() => {
      if (activeStopwatchSetInfo) {
        const set = currentWorkout?.exercises
          .find((exercise) => exercise.stableExerciseId === activeStopwatchSetInfo.exerciseId)
          ?.sets.find((set) => set.stableSetId === activeStopwatchSetInfo.setId)
        if (!set || set.completed) {
          stopStopwatch(currentStopwatchElapsedTimeRef.current)
        }
      }
    }, [activeStopwatchSetInfo, currentWorkout, stopStopwatch])

    return {
      // Page navigation
      currentPage,
      setCurrentPage,

      // Workout properties
      addWorkoutNote,
      removeCurrentWorkout,
      currentWorkout,
      startWorkout,
      maybeCopyWorkout,
      forceCopyWorkout,

      // Exercise properties
      addExercise,
      deleteExercise,
      currentExercises,
      updateExerciseSettings,

      // Set properties
      addSet,
      updateSet,
      removeSet,

      // Timer properties
      timerDurationSeconds,
      setTimerDurationSeconds,

      // Stopwatch properties
      activeStopwatchSetInfo,
      startStopwatch,
      stopStopwatch,
      updateStopwatchElapsedTime,
    }
  },
)
