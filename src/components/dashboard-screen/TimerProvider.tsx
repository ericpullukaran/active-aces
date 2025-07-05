"use client"
import { useCallback, useState, useRef, useEffect } from "react"
import { createTypedContext } from "~/lib/utils/context"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"

export const [TimerProvider, useTimer] = createTypedContext(() => {
  // Ref to store the current elapsed time of the stopwatch
  const currentStopwatchElapsedTimeRef = useRef<number>(0)

  const [timerDurationSeconds, setTimerDurationSeconds] = useState<{
    setId: string
    duration: number
  } | null>(null)
  useEffect(() => {
    if (timerDurationSeconds && timerDurationSeconds.duration > 0) {
      // TODO: Searching through all exercises when currentWorkout changes is not efficient
      const set = workoutStore.currentWorkout?.exercises.find((exercise) =>
        exercise.sets.find((set) => set.stableSetId === timerDurationSeconds.setId),
      )
      if (!set) {
        setTimerDurationSeconds(null)
      }
    }
  }, [timerDurationSeconds])

  const [activeStopwatchSetInfo, setActiveStopwatchSetInfo] = useState<{
    stableExerciseId: string
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
        workoutActions.updateSet(
          activeStopwatchSetInfo.stableExerciseId,
          activeStopwatchSetInfo.setId,
          {
            time: elapsedSeconds,
          },
        )
      }
      setActiveStopwatchSetInfo(null)
    },
    [activeStopwatchSetInfo],
  )
  const startStopwatch = useCallback(
    (props: { stableExerciseId: string; setId: string; initialSeconds?: number }) => {
      // If there's an active stopwatch, stop it and save its progress
      if (activeStopwatchSetInfo) {
        stopStopwatch(currentStopwatchElapsedTimeRef.current)
        currentStopwatchElapsedTimeRef.current = 0
      }

      setActiveStopwatchSetInfo({
        stableExerciseId: props.stableExerciseId,
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
      const set = workoutStore.currentWorkout?.exercises
        .find((exercise) => exercise.stableExerciseId === activeStopwatchSetInfo.stableExerciseId)
        ?.sets.find((set) => set.stableSetId === activeStopwatchSetInfo.setId)
      if (!set || set.completed) {
        stopStopwatch(currentStopwatchElapsedTimeRef.current)
      }
    }
  }, [activeStopwatchSetInfo, stopStopwatch])

  return {
    // Timer properties
    timerDurationSeconds,
    setTimerDurationSeconds,

    // Stopwatch properties
    activeStopwatchSetInfo,
    startStopwatch,
    stopStopwatch,
    updateStopwatchElapsedTime,
  }
})
