import { relations } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import { createPrimaryKeyId } from "../cuid";

const custom = {
  primaryKey: () =>
    text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => createPrimaryKeyId()),
  timestamp: (name: string) =>
    integer(name, { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
};
export const userProfiles = sqliteTable("user_profiles", {
  id: text("id").primaryKey(),
  createdAt: custom.timestamp("created_at"),
  height: real("height"),
});

export const usersRelations = relations(userProfiles, ({ many }) => ({
  // measurements: many(measurementEntries), we have to add the other table before we can keep this in
  workouts: many(workouts),
}));

// MeasurementEntry
export const measurementEntries = sqliteTable(
  "measurement_entries",
  {
    id: custom.primaryKey(),
    userId: text("user_id").notNull(),
    createdAt: custom.timestamp("created_at"),
    weight: real("weight"),
  },
  (t) => {
    return {
      userId: index("measurement_entries_user_id").on(t.userId),
    };
  },
);

export const exercises = sqliteTable(
  "exercises",
  {
    id: custom.primaryKey(),
    name: text("name").notNull(),
    primaryMuscleGroupId: text("primary_muscle_group_id").notNull(),
    description: text("description"),
    commonPitfalls: text("common_pitfalls"),
    thumbnailUrl: text("thumbnail_url"),
    gifUrl: text("gif_url"),
    measurementType: text("measurement_type").notNull(),
  },
  (t) => ({
    primaryMuscleGroup: index("exercises_primary_muscle_group_id").on(
      t.primaryMuscleGroupId,
    ),
  }),
);

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  primaryMuscleGroup: one(muscleGroups, {
    fields: [exercises.primaryMuscleGroupId],
    references: [muscleGroups.id],
  }),
  secondaryMuscleGroups: many(exercisesToSecondaryMuscleGroups),
}));

export const muscleGroups = sqliteTable("muscle_groups", {
  id: custom.primaryKey(),
  name: text("name").notNull(),
});

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesToSecondaryMuscleGroups = sqliteTable(
  "exercises_to_secondary_muscle_groups",
  {
    id: custom.primaryKey(),
    exerciseId: text("exercise_id").notNull(),
    muscleGroupId: text("muscle_group_id").notNull(),
  },
  (t) => ({
    exerciseId: index("exercises_to_secondary_muscle_groups_exercise_id").on(
      t.exerciseId,
    ),
    muscleGroupId: index(
      "exercises_to_secondary_muscle_groups_muscle_group_id",
    ).on(t.muscleGroupId),
  }),
);

export const exercisesToSecondaryMuscleGroupsRelations = relations(
  exercisesToSecondaryMuscleGroups,
  ({ one }) => ({
    exercise: one(exercises, {
      fields: [exercisesToSecondaryMuscleGroups.exerciseId],
      references: [exercises.id],
    }),
    muscleGroup: one(muscleGroups, {
      fields: [exercisesToSecondaryMuscleGroups.muscleGroupId],
      references: [muscleGroups.id],
    }),
  }),
);

export const workouts = sqliteTable(
  "workouts",
  {
    id: custom.primaryKey(),
    name: text("name"),
    startTime: integer("start_time", { mode: "timestamp_ms" }),
    endTime: integer("end_time", { mode: "timestamp_ms" }),
    timer: integer("timer"),
    notes: text("notes"),
    templateId: text("template_id"),
    userId: text("user_id").notNull(),
  },
  (t) => ({
    userId: index("workouts_user_id").on(t.userId),
    templateId: index("workouts_template_id").on(t.templateId),
  }),
);

export const workoutRelations = relations(workouts, ({ one, many }) => ({
  user: one(userProfiles, {
    fields: [workouts.userId],
    references: [userProfiles.id],
  }),
  exercises: many(workoutExercises),
}));

// WorkoutExercise
export const workoutExercises = sqliteTable(
  "workout_exercises",
  {
    id: custom.primaryKey(),
    order: integer("order").notNull(),
    exerciseId: text("exercise_id").notNull(),
    timer: integer("timer"),
    notes: text("notes"),
    workoutId: text("workout_id").notNull(),
  },
  (t) => ({
    workoutId: index("workout_exercises_workout_id").on(t.workoutId),
    exerciseId: index("workout_exercises_exercise_id").on(t.exerciseId),
  }),
);

export const workoutExerciseRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    sets: many(workoutExerciseSets),
  }),
);

// WorkoutExerciseSet
export const workoutExerciseSets = sqliteTable(
  "workout_exercise_sets",
  {
    id: custom.primaryKey(),
    weight: real("weight"),
    numReps: integer("num_reps"),
    time: integer("time"),
    distance: real("distance"),
    complete: integer("complete", { mode: "boolean" }),
    order: integer("order"),
    workoutExerciseId: text("workout_exercise_id"),
  },
  (t) => ({
    workoutExerciseId: index("workout_exercise_sets_workout_exercise_id").on(
      t.workoutExerciseId,
    ),
  }),
);

export const workoutExerciseSetsRelations = relations(
  workoutExerciseSets,
  ({ one }) => ({
    workoutExercise: one(workoutExercises, {
      fields: [workoutExerciseSets.workoutExerciseId],
      references: [workoutExercises.id],
    }),
  }),
);
