import React, { useMemo } from "react"
import WorkoutExerciseWidget from "../WorkoutExerciseWidget"
import { useWorkoutManager } from "./WorkoutManagerProvider"
import { AnimatePresence } from "motion/react"
import WorkoutStats from "../WorkoutStats"
import { useExercises } from "~/lib/utils/useExercises"
import { TextShimmer } from "../ui/text-shimer"

export default function WorkoutScreen() {
  const { currentExercises } = useWorkoutManager()
  const { isLoading, filteredExercises } = useExercises()

  const exercisesWithMetadata = useMemo(() => {
    if (!filteredExercises.length) return []

    return currentExercises
      .map((workoutExercise) => {
        const dbExercise = filteredExercises.find(([_, e]) => e.id === workoutExercise.exerciseId)
        if (!dbExercise) return null
        const [_, exercise] = dbExercise
        return { ...workoutExercise, metadata: exercise }
      })
      .filter((e) => e !== null)
  }, [currentExercises, filteredExercises])

  return (
    <div className="relative isolate">
      <WorkoutStats />
      <div className="isolate flex flex-col items-center gap-8 pt-10 pb-52">
        <AnimatePresence mode="popLayout">
          {isLoading && <TextShimmer className="text-center text-sm">Loading...</TextShimmer>}
          {!isLoading && exercisesWithMetadata.length === 0 && (
            <div className="text-muted-foreground text-center text-sm">
              Add an exercise to get started!
            </div>
          )}
          {exercisesWithMetadata.map((exercise) => (
            <WorkoutExerciseWidget key={exercise.stableExerciseId} exercise={exercise} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
