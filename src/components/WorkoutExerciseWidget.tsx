"use client"
import { useCallback, useState } from "react"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"
import { motion } from "motion/react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

export default function WorkoutExerciseWidget({
  order,
  exercise,
}: {
  order: number
  exercise: WorkoutExerciseWithMetadata
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { deleteExercise } = useWorkoutManager()
  const collapseExercise = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])
  const handleDeleteExercise = useCallback(() => {
    deleteExercise(order)
  }, [deleteExercise, order])

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      layoutId={exercise.stableId}
      className="bg-card w-full max-w-lg rounded-xl"
    >
      {/* header */}
      <WorkoutExerciseHeader
        exercise={exercise}
        collapseExercise={collapseExercise}
        deleteExercise={handleDeleteExercise}
      />
      {/* body */}
      <AnimatedVisibility isVisible={!collapsed}>
        <WorkoutExerciseWidgetBody exercise={exercise} />
      </AnimatedVisibility>
    </motion.div>
  )
}
