import { relations } from "drizzle-orm"
import { index, integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createPrimaryKeyId } from "./cuid"
import { MeasurementType } from "./types"

const custom = {
  primaryKey: () =>
    text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createPrimaryKeyId()),
  timestamp: (name: string) => integer(name, { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
}

// Users Table
export const users = sqliteTable("users", {
  id: custom.primaryKey(),

  name: text("name"),
  createdAt: custom.timestamp("created_at").notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  exercises: many(exercises),
  workouts: many(workouts),
}))

// Muscle Groups Table
export const muscleGroups = sqliteTable("muscle_groups", {
  id: custom.primaryKey(),

  name: text("name").notNull().unique(),
  description: text("description"),
})

// Relation definitions for muscle groups
export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  primaryExercises: many(exercises),
  exerciseMuscleGroups: many(exerciseMuscleGroups),
}))

// Exercise Table
export const exercises = sqliteTable(
  "exercises",
  {
    id: custom.primaryKey(),
    name: text("name").notNull(),
    measurementType: text("measurement_type").notNull().$type<MeasurementType>(),
    primaryMuscleGroupId: text("primary_muscle_group_id"),
    creatorId: text("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    description: text("description"),
    defaultRestTime: integer("default_rest_time"), // Rest time in ms
    thumbnailUrl: text("thumbnail_url"),
    createdAt: custom.timestamp("created_at").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
  },
  (t) => [
    index("idx_exercise_name").on(t.name),
    index("idx_exercises_measurement_type").on(t.measurementType),
    index("idx_exercise_primary_muscle_group_id").on(t.primaryMuscleGroupId),
  ],
)

// Relation definitions for exercises
export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  primaryMuscleGroup: one(muscleGroups, {
    fields: [exercises.primaryMuscleGroupId],
    references: [muscleGroups.id],
  }),
  exerciseMuscleGroups: many(exerciseMuscleGroups),
  creator: one(users, {
    fields: [exercises.creatorId],
    references: [users.id],
  }),
}))

// Join table for exercises and accessory muscle groups
export const exerciseMuscleGroups = sqliteTable(
  "exercise_muscle_groups",
  {
    id: custom.primaryKey(),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscleGroupId: text("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("idx_exercise_muscle_group_exercise_id").on(t.exerciseId),
    index("idx_exercise_muscle_group_muscle_group_id").on(t.muscleGroupId),
  ],
)

// Relation definitions for the join table
export const exerciseMuscleGroupsRelations = relations(exerciseMuscleGroups, ({ one }) => ({
  exercise: one(exercises, {
    fields: [exerciseMuscleGroups.exerciseId],
    references: [exercises.id],
  }),
  muscleGroup: one(muscleGroups, {
    fields: [exerciseMuscleGroups.muscleGroupId],
    references: [muscleGroups.id],
  }),
}))

// Workout Table
export const workouts = sqliteTable(
  "workouts",
  {
    id: custom.primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    startTime: custom.timestamp("start_time").notNull(),
    endTime: integer("end_time", { mode: "timestamp_ms" }),
    notes: text("notes"),
    createdAt: custom.timestamp("created_at").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
  },
  (t) => [
    index("idx_workout_user_id").on(t.userId),
    index("idx_workout_start_time").on(t.startTime),
  ],
)

// Workout Relations
export const workoutsRelations = relations(workouts, ({ one, many }) => ({
  workoutExercises: many(workoutExercises),
  user: one(users, {
    fields: [workouts.userId],
    references: [users.id],
  }),
}))

// Workout Exercises - Join table between workouts and exercises
export const workoutExercises = sqliteTable(
  "workout_exercises",
  {
    id: custom.primaryKey(),

    workoutId: text("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id").notNull(),
    order: integer("order").notNull(),
    restTime: integer("rest_time"), // Override default rest time in exercise if needed
    notes: text("notes"),
    createdAt: custom.timestamp("created_at").notNull(),
  },
  (t) => [
    index("idx_workout_exercise_workout_id_order").on(t.workoutId, t.order),
    index("idx_workout_exercises_exercise").on(t.exerciseId, t.createdAt),
  ],
)

// WorkoutExercise Relations
export const workoutExercisesRelations = relations(workoutExercises, ({ one, many }) => ({
  workout: one(workouts, {
    fields: [workoutExercises.workoutId],
    references: [workouts.id],
  }),
  exercise: one(exercises, {
    fields: [workoutExercises.exerciseId],
    references: [exercises.id],
  }),
  sets: many(exerciseSets),
}))

// Exercise Sets - Records actual performance data for each exercise in a workout
export const exerciseSets = sqliteTable(
  "exercise_sets",
  {
    id: custom.primaryKey(),

    workoutExerciseId: text("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
    weight: real("weight"),
    reps: integer("reps"),
    assistedReps: integer("assisted_reps"),
    distance: real("distance"),
    time: integer("time"), // In ms
    completed: integer("completed", { mode: "boolean" }).notNull().default(false),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
  },
  (t) => [
    index("idx_exercise_sets_workout_exercise").on(t.workoutExerciseId, t.order),
    index("idx_exercise_set_completed_at").on(t.completedAt),
  ],
)

// ExerciseSet Relations
export const exerciseSetsRelations = relations(exerciseSets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [exerciseSets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}))
