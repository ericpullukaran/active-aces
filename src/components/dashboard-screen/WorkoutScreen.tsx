import React, { useMemo } from "react"
import WorkoutExerciseWidget from "../WorkoutExerciseWidget"
import { useWorkoutManager } from "./WorkoutManagerProvider"
import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"
import { AnimatePresence } from "motion/react"

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
    <div className="flex flex-col items-center gap-8 pt-20">
      <AnimatePresence mode="popLayout">
        {exercisesWithMetadata.map((exercise, idx) => (
          <WorkoutExerciseWidget key={exercise.stableId} order={idx} exercise={exercise} />
        ))}
      </AnimatePresence>
    </div>
  )
}
