"use client"
import { useCallback, useState } from "react"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { type WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"
import { motion } from "motion/react"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"
import { workoutStore } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"

export default function WorkoutExerciseWidget({
  exercise,
  exerciseIndex,
}: {
  exercise: WorkoutExerciseWithMetadata
  exerciseIndex: number
}) {
  const [collapsed, setCollapsed] = useState(false)
  const snap = useSnapshot(workoutStore)

  // We need to observer & re-calculate height for the widget when the height changes
  // i.e. when the user adds a set or removes a set
  const setCount = snap.currentWorkout?.exercises[exerciseIndex]?.sets.length

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
      <WorkoutExerciseHeader exercise={exercise} collapseExercise={collapseExercise} />
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
