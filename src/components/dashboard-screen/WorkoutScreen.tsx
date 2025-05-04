import React, { useMemo } from "react"
import WorkoutExerciseWidget from "../WorkoutExerciseWidget"
import { useWorkoutManager } from "./WorkoutManagerProvider"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"
import { AnimatePresence } from "motion/react"
import WorkoutStats from "../WorkoutStats"

export default function WorkoutScreen() {
  const trpc = useTRPC()
  const { currentExercises } = useWorkoutManager()
  const exercisesQuery = useQuery(trpc.exercises.getAll.queryOptions())

  const exercisesWithMetadata = useMemo(() => {
    if (!exercisesQuery.data) return []

    return currentExercises
      .map((workoutExercise) => {
        const dbExercise = exercisesQuery.data.get(workoutExercise.exerciseId)
        if (!dbExercise) return null
        return { ...workoutExercise, metadata: dbExercise }
      })
      .filter((e) => e !== null)
  }, [currentExercises, exercisesQuery.data])

  return (
    <div className="relative isolate">
      <WorkoutStats />
      <div className="isolate flex flex-col items-center gap-8 pt-10 pb-36">
        <AnimatePresence mode="popLayout">
          {exercisesWithMetadata.length === 0 && (
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
