import { z } from "zod"
import { type Doc } from "../db"

// Schema for a workout exercise set
export const ExerciseSetSchema = z.object({
  // A stable ID that doesn't change when items are reordered
  stableSetId: z.string(),

  weight: z.number().optional(),
  reps: z.number().optional(),
  assistedReps: z.number().optional(),
  distance: z.number().optional(),
  time: z.number().optional(),
  completed: z.boolean().optional(),
  completedAt: z.date().optional(),
})
export type ExerciseSet = z.infer<typeof ExerciseSetSchema>

// Schema for a workout exercise
export const WorkoutExerciseSchema = z.object({
  // A stable ID that doesn't change when items are reordered
  stableExerciseId: z.string(),

  exerciseId: z.string(),
  notes: z.string().optional(),
  sets: z.array(ExerciseSetSchema),

  // Settings for the exercise
  enableAssistedReps: z.boolean().default(false),
  enableWeightedReps: z.boolean().default(false),
  restTimeMs: z.number().optional(),
})
export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>

// Schema for the entire workout
export const PutWorkoutSchema = z.object({
  name: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().default(false),
  exercises: z.array(WorkoutExerciseSchema),
})
export type PutWorkout = z.infer<typeof PutWorkoutSchema>

export type DbExercise = Doc<"exercises"> & {
  primaryMuscleGroup: Doc<"muscleGroups"> | null
  exerciseMuscleGroups: { muscleGroup: Doc<"muscleGroups"> }[]
}
export type DbExercisesMap = Map<string, DbExercise>

export type WorkoutExerciseWithMetadata = WorkoutExercise & {
  metadata: DbExercise
}

export type WorkoutHistoryExercise = Doc<"workouts"> & {
  workoutExercises: (Doc<"workoutExercises"> & {
    exercise: Doc<"exercises"> & {
      primaryMuscleGroup: Doc<"muscleGroups"> | null
    }
    sets: Doc<"exerciseSets">[]
  })[]
}
