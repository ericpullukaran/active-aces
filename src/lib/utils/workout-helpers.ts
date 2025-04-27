import { format, differenceInMinutes } from "date-fns"
import { WorkoutHistoryExercise } from "~/lib/types/workout"

/**
 * Formats a workout date with the specified format string
 */
export function formatWorkoutDate(
  date: Date | string | null | undefined,
  formatString: string,
): string {
  if (!date) return ""
  return format(new Date(date), formatString)
}

/**
 * Calculates the duration of a workout in minutes
 */
export function calculateWorkoutDuration(
  startTime: Date | string | null | undefined,
  endTime: Date | string | null | undefined,
): string | null {
  if (!startTime || !endTime) return null

  const minutes = differenceInMinutes(new Date(endTime), new Date(startTime))
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`
}

/**
 * Extracts all unique muscle groups from a workout
 */
export function extractMuscleGroups(workout: WorkoutHistoryExercise): string[] {
  const muscleGroupsSet = new Set<string>()

  workout.workoutExercises.forEach((we) => {
    if (we.exercise.primaryMuscleGroup?.name) {
      muscleGroupsSet.add(we.exercise.primaryMuscleGroup.name)
    }
  })

  return Array.from(muscleGroupsSet)
}
