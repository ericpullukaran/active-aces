"use client"
import { useCallback, useState } from "react"
import AnimatedVisibility from "~/lib/utils/AnimatedVisibility"
import { WorkoutExerciseHeader } from "./WorkoutExerciseHeader"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"

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
    <div className="bg-card max-w-lg rounded-xl">
      {/* header */}
      <WorkoutExerciseHeader exercise={exercise} collapseExercise={collapseExercise} />
      {/* body */}
      <AnimatedVisibility isVisible={!collapsed}>
        <div className="mt-4">
          hello this is some kinda arbitrary text that is really long really long really long really
          long really long really long really long
        </div>
      </AnimatedVisibility>
    </div>
  )
}
