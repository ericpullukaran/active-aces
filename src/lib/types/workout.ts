import { z } from "zod"
import { Doc } from "../db"

// Schema for a workout exercise set
export const ExerciseSetSchema = z.object({
  order: z.number(),
  weight: z.number().optional(),
  reps: z.number().optional(),
  distance: z.number().optional(),
  time: z.number().optional(),
  completed: z.boolean().optional(),
  completedAt: z.date().optional(),
})
export type ExerciseSet = z.infer<typeof ExerciseSetSchema>

// Schema for a workout exercise
export const WorkoutExerciseSchema = z.object({
  exerciseId: z.string(),
  notes: z.string().optional(),
  sets: z.array(ExerciseSetSchema),
})
export type WorkoutExercise = z.infer<typeof WorkoutExerciseSchema>

// Schema for the entire workout
export const PutWorkoutSchema = z.object({
  name: z.string(),
  startTime: z.date(),
  endTime: z.date().optional(),
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseSchema),
})
export type PutWorkout = z.infer<typeof PutWorkoutSchema>

export type Exercise = Doc<"exercises"> & { primaryMuscleGroup: Doc<"muscleGroups"> | undefined }
