"use client"
import { useCallback, useState } from "react"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import WorkoutExerciseWidgetBody from "./WorkoutExerciseWidgetBody"

export default function WorkoutExerciseWidget({
  exercise,
}: {
  exercise: WorkoutExerciseWithMetadata
}) {
  const [collapsed, setCollapsed] = useState(false)
  const collapseExercise = useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return (
    <div className="bg-card w-full max-w-lg rounded-xl">
      {/* header */}
      <WorkoutExerciseHeader exercise={exercise} collapseExercise={collapseExercise} />
      {/* body */}
      <AnimatedVisibility isVisible={!collapsed}>
        <WorkoutExerciseWidgetBody exercise={exercise} />
      </AnimatedVisibility>
    </div>
  )
}
