"use client"
import { useCallback, useState, useEffect } from "react"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { type WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"
import { motion } from "motion/react"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"
import { workoutStore, workoutActions } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { type TRPCQueryKey } from "@trpc/tanstack-react-query"

const MIN_SETS_TO_PREFILL = 6

export default function WorkoutExerciseWidget({
  exercise,
  exerciseIndex,
}: {
  exercise: WorkoutExerciseWithMetadata
  exerciseIndex: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const snap = useSnapshot(workoutStore)
  const trpc = useTRPC()

  // We need to observer & re-calculate height for the widget when the height changes
  // i.e. when the user adds a set or removes a set
  const setCount = snap.currentWorkout?.exercises[exerciseIndex]?.sets.length
  const currentSetsNeeded = Math.max(setCount || 0, MIN_SETS_TO_PREFILL)
  const {
    data: previousSetMetrics,
    isSuccess,
    isLoading,
  } = useQuery({
    ...trpc.workouts.getPreviousSetMetrics.queryOptions({
      exerciseId: exercise.metadata.id,
      numberOfSets: currentSetsNeeded,
    }),
    queryKey: [
      "previous-set-metrics",
      exercise.exerciseId,
      currentSetsNeeded,
    ] as unknown as TRPCQueryKey,
    enabled: !!setCount,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (isSuccess && previousSetMetrics) {
      workoutActions.prefillExerciseSets(exercise.stableExerciseId, previousSetMetrics)
    }
  }, [isSuccess, setCount, previousSetMetrics, exercise.stableExerciseId])

  const collapseExercise = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      layoutId={exercise.stableExerciseId}
      className="bg-card w-full max-w-lg rounded-xl"
    >
      {/* header */}
      <WorkoutExerciseHeader
        exercise={exercise}
        collapseExercise={collapseExercise}
        isPrefilling={isLoading}
      />
      {/* body */}
      <AnimatedVisibility isVisible={!collapsed} dependency={setCount}>
        <WorkoutExerciseWidgetBody
          stableExerciseId={exercise.stableExerciseId}
          exerciseMeta={exercise.metadata}
        />
      </AnimatedVisibility>
    </motion.div>
  )
}
