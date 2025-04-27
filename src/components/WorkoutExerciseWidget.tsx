"use client"
import { useCallback, useState } from "react"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"
import { motion } from "motion/react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"

export default function WorkoutExerciseWidget({
  exercise,
}: {
  exercise: WorkoutExerciseWithMetadata
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { currentWorkout, deleteExercise } = useWorkoutManager()
  const collapseExercise = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])
  const handleDeleteExercise = useCallback(() => {
    deleteExercise(exercise.stableExerciseId)
  }, [deleteExercise])

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
        deleteExercise={handleDeleteExercise}
      />
      {/* body */}
      <AnimatedVisibility isVisible={!collapsed} dependency={currentWorkout}>
        <WorkoutExerciseWidgetBody exercise={exercise} />
      </AnimatedVisibility>
    </motion.div>
  )
}
