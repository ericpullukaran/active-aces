"use client"
import { useCallback, useState, useEffect } from "react"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { type WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"
import { motion, MotionConfig, type DragControls } from "motion/react"
import { workoutStore, workoutActions } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import useMeasure from "react-use-measure"

const MIN_SETS_TO_PREFILL = 6

export default function WorkoutExerciseWidget({
  exercise,
  exerciseIndex,
  dragControls,
}: {
  exercise: WorkoutExerciseWithMetadata
  exerciseIndex: number
  dragControls?: DragControls
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [elementRef, bounds] = useMeasure()
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
    ...trpc.workouts.history.getPreviousSetMetrics.queryOptions({
      exerciseId: exercise.metadata.id,
      numberOfSets: currentSetsNeeded,
    }),
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
    <MotionConfig transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}>
      <motion.div
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        layoutId={exercise.stableExerciseId}
        className="bg-card w-full max-w-lg rounded-xl"
        style={{ borderRadius: "12px" }}
      >
        {/* header */}
        <WorkoutExerciseHeader
          exercise={exercise}
          collapseExercise={collapseExercise}
          isPrefilling={isLoading}
          dragControls={dragControls}
        />
        {/* body */}
        <motion.div
          layout
          animate={{ height: collapsed ? 0 : bounds.height }}
          style={{ overflow: "hidden" }}
        >
          <div ref={elementRef}>
            <WorkoutExerciseWidgetBody
              stableExerciseId={exercise.stableExerciseId}
              exerciseMeta={exercise.metadata}
            />
          </div>
        </motion.div>
      </motion.div>
    </MotionConfig>
  )
}
