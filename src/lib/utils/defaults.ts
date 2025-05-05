import { createPrimaryKeyId } from "../db/cuid"
import { type ExerciseSet, type PutWorkout, type WorkoutExercise } from "../types/workout"

export const defaultWorkout = (name: string = "Workout"): PutWorkout => {
  return {
    name,
    startTime: new Date(),
    exercises: [],
  }
}

export const defaultWorkoutExercise = (exerciseId: string): WorkoutExercise => {
  return {
    stableExerciseId: createPrimaryKeyId(),

    exerciseId,
    sets: [defaultExerciseSet()],
    enableAssistedReps: false,
    enableWeightedReps: false,
  }
}

export const defaultExerciseSet = (): ExerciseSet => {
  return {
    stableSetId: createPrimaryKeyId(),

    order: 0,
    reps: 0,
    assistedReps: 0,
    weight: 0,
    distance: 0,
    time: 0,
    completed: false,
  }
}
