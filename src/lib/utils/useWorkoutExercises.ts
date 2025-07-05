import { useSnapshot } from "valtio"
import { workoutStore } from "../stores/workoutStore"
import { useExercises } from "./useExercises"

export const useWorkoutExercises = () => {
  const { isLoading, rawData } = useExercises()
  const snap = useSnapshot(workoutStore)
  // We observe only the stableExerciseId to avoid re-rendering the entire workout when the exercise is updated
  const _exerciseIdsReaction = snap.currentWorkout?.exercises.map((e) => e.stableExerciseId)
  const exercises = workoutStore.currentWorkout?.exercises
  return {
    isLoading,
    exercises:
      isLoading || !exercises || !rawData
        ? []
        : exercises.map((e) => {
            const dbExercise = rawData.get(e.exerciseId)
            if (!dbExercise) {
              throw new Error(`Exercise ${e.exerciseId} not found`)
            }
            return {
              ...e,
              metadata: dbExercise,
            }
          }),
  }
}
