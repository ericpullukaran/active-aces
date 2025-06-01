import type { Doc } from "../db"
import { createPrimaryKeyId } from "../db/cuid"
import type { ExerciseSet, PutWorkout, WorkoutExercise } from "../types/workout"
import { getTimeOfDay } from "./dates"

export const defaultWorkout = (name: string = `${getTimeOfDay()} Workout`): PutWorkout => {
  return {
    name,
    startTime: new Date(),
    exercises: [],
    isTemplate: false,
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

const defaultSetValues = {
  reps: 0,
  assistedReps: 0,
  weight: 0,
  distance: 0,
  time: 0,
  completed: false,
} satisfies Record<
  keyof Omit<Doc<"exerciseSets">, "id" | "order" | "workoutExerciseId" | "completedAt">,
  unknown
>
export const defaultExerciseSet = (): Required<Omit<ExerciseSet, "completedAt">> => {
  return {
    stableSetId: createPrimaryKeyId(),

    ...defaultSetValues,
  }
}

export const aDefaultExerciseSetWith = (
  set: Partial<Doc<"exerciseSets">>,
): Required<Omit<ExerciseSet, "completedAt">> => {
  const ret = {
    weight: set.weight ?? defaultSetValues.weight,
    reps: set.reps ?? defaultSetValues.reps,
    assistedReps: set.assistedReps ?? defaultSetValues.assistedReps,
    distance: set.distance ?? defaultSetValues.distance,
    time: set.time ?? defaultSetValues.time,
    completed: set.completed ?? defaultSetValues.completed,
    completedAt: set.completedAt ?? undefined,
  } satisfies Record<keyof Omit<ExerciseSet, "stableSetId">, unknown>
  return {
    ...defaultExerciseSet(),
    ...ret,
  }
}

export const isSetADefaultSet = (set: ExerciseSet): boolean => {
  const defaultComparison = {
    weight: set.weight === defaultSetValues.weight,
    reps: set.reps === defaultSetValues.reps,
    assistedReps: set.assistedReps === defaultSetValues.assistedReps,
    distance: set.distance === defaultSetValues.distance,
    time: set.time === defaultSetValues.time,
    completed: !set.completed,
  } satisfies Record<keyof typeof defaultSetValues, boolean>
  return Object.values(defaultComparison).every(Boolean)
}
