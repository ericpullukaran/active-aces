import { and, desc, eq, lt, exists } from "drizzle-orm"
import { type Doc, type DB } from "../db"
import { type PutWorkout } from "../types/workout"
import { exerciseSets, workoutExercises, workouts } from "../db/schema"
import { aDefaultExerciseSetWith } from "../utils/defaults"

/**
 * Retrieves paginated workout history with exercises and muscle groups
 */
const getWorkoutHistoryWithExercises = async (
  db: DB,
  {
    userId,
    isTemplate,
    limit = 10,
    cursor,
  }: { userId: string; isTemplate: boolean; limit?: number; cursor?: string },
) => {
  // Get workouts by user ID, ordered by creation date
  let query = db.query.workouts.findMany({
    where: (workout) => and(eq(workout.userId, userId), eq(workout.isTemplate, isTemplate)),
    orderBy: [desc(workouts.createdAt)],
    limit,
    with: {
      workoutExercises: {
        orderBy: [workoutExercises.order],
        with: {
          sets: true,
          exercise: {
            with: {
              primaryMuscleGroup: true,
            },
          },
        },
      },
    },
  })

  // If cursor is provided, we need to get items after that cursor
  if (cursor) {
    const cursorWorkout = await db.query.workouts.findFirst({
      where: (workout) => and(eq(workout.id, cursor), eq(workout.isTemplate, isTemplate)),
    })

    if (cursorWorkout) {
      // Update the query with the cursor filter
      query = db.query.workouts.findMany({
        where: (workout) =>
          and(
            eq(workout.userId, userId),
            eq(workout.isTemplate, isTemplate),
            lt(workout.createdAt, cursorWorkout.createdAt),
          ),
        orderBy: [desc(workouts.createdAt)],
        limit,
        with: {
          workoutExercises: {
            orderBy: [workoutExercises.order],
            with: {
              sets: true,
              exercise: {
                with: {
                  primaryMuscleGroup: true,
                },
              },
            },
          },
        },
      })
    }
  }

  return query
}

/**
 * Build a CSV string containing all workout data (workouts → exercises → sets) for a user.
 * Columns are designed to be stable so we can build an importer later.
 */
const exportUserWorkoutsAsCsv = async (
  db: DB,
  {
    userId,
    includeTemplates = false,
  }: {
    userId: string
    /** If true, will include templates as well; by default only completed workouts are exported */
    includeTemplates?: boolean
  },
) => {
  const allWorkouts = await db.query.workouts.findMany({
    where: (workout) =>
      and(
        eq(workout.userId, userId),
        includeTemplates
          ? eq(workout.isTemplate, workout.isTemplate)
          : eq(workout.isTemplate, false),
      ),
    orderBy: [desc(workouts.startTime)],
    with: {
      workoutExercises: {
        orderBy: [workoutExercises.order],
        with: {
          exercise: true,
          sets: { orderBy: [exerciseSets.order] },
        },
      },
    },
  })

  const headers = [
    "title",
    "start_time",
    "end_time",
    "notes",
    ...(includeTemplates ? ["is_template"] : []),
    "exercise_title",
    "measurement_type",
    "exercise_order",
    "rest_time_ms",
    "exercise_notes",
    "set_index",
    "weight_kg",
    "reps",
    "assisted_reps",
    "distance_m",
    "duration_ms",
    "completed",
    "completed_at",
  ]

  const escapeCsv = (value: unknown): string => {
    if (value === null || value === undefined) return ""
    const str = String(value)
    if (str.includes('"') || str.includes(",") || str.includes("\n")) {
      return `"${str.replace(/\"/g, '""')}"`
    }
    return str
  }

  const rows: string[] = []
  rows.push(headers.join(","))

  for (const workout of allWorkouts) {
    const base = [
      workout.name,
      workout.startTime.toISOString(),
      workout.endTime?.toISOString() ?? "",
      workout.notes ?? "",
      ...(includeTemplates ? [workout.isTemplate ? 1 : 0] : []),
    ]

    for (const workoutExercise of workout.workoutExercises) {
      const ex = workoutExercise.exercise
      const exerciseBase = [
        ex?.name ?? "",
        ex?.measurementType ?? "",
        workoutExercise.order,
        workoutExercise.restTime ?? "",
        workoutExercise.notes ?? "",
      ]

      for (let idx = 0; idx < workoutExercise.sets.length; idx++) {
        const set = workoutExercise.sets[idx]
        const setCols = [
          idx,
          set.weight ?? "",
          set.reps ?? "",
          set.assistedReps ?? "",
          set.distance ?? "",
          set.time ?? "",
          set.completed ? 1 : 0,
          set.completedAt?.toISOString() ?? "",
        ]

        const line = [...base, ...exerciseBase, ...setCols].map(escapeCsv).join(",")
        rows.push(line)
      }
    }
  }

  return rows.join("\n")
}

/**
 * Deletes all workouts for a user. By default, excludes templates.
 */
const deleteAllUserWorkouts = async (
  db: DB,
  {
    userId,
    includeTemplates = false,
  }: {
    userId: string
    includeTemplates?: boolean
  },
) => {
  if (includeTemplates) {
    return await db.delete(workouts).where(eq(workouts.userId, userId))
  }
  return await db
    .delete(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.isTemplate, false)))
}

/**
 * Import workouts from a CSV previously exported by this system.
 * - Accepts CSV text, parses rows, groups into workouts/exercises/sets
 * - Creates exercises when missing (matching by exact exercise name)
 */
const importUserWorkoutsFromCsv = async (
  db: DB,
  opts: {
    userId: string
    csv: string
  },
) => {
  throw new Error("Not implemented")
}

/**
 * Gets the previous set metrics for a specific exercise, looking back through workout history
 * to find the most recent data for each set position
 */
const getPreviousSetMetrics = async (
  db: DB,
  {
    exerciseId,
    numberOfSets,
    userId,
  }: {
    exerciseId: string
    numberOfSets: number
    userId: string
  },
) => {
  const recentWorkouts = await db.query.workouts.findMany({
    where: (workout) =>
      and(
        eq(workout.userId, userId),
        eq(workout.isTemplate, false),
        exists(
          db
            .select()
            .from(workoutExercises)
            .where(
              and(
                eq(workoutExercises.workoutId, workout.id),
                eq(workoutExercises.exerciseId, exerciseId),
              ),
            ),
        ),
      ),
    orderBy: [desc(workouts.startTime)],
    limit: 50,
    with: {
      workoutExercises: {
        where: (workoutExercise) => eq(workoutExercise.exerciseId, exerciseId),
        orderBy: [workoutExercises.order],
        with: {
          sets: {
            orderBy: [exerciseSets.order],
          },
        },
      },
    },
  })

  // Create array of the requested length, filled with most recent set data for each position
  const result: (Doc<"exerciseSets"> | null)[] = []

  for (let setIndex = 0; setIndex < numberOfSets; setIndex++) {
    let foundSet: Doc<"exerciseSets"> | null = null

    // Look through workouts from most recent to oldest to find data for this set position
    for (const workout of recentWorkouts) {
      const workoutExercise = workout.workoutExercises[0]
      if (workoutExercise && setIndex < workoutExercise.sets.length) {
        foundSet = workoutExercise.sets[setIndex]
        break // Found the most recent data for this set position
      }
    }

    result.push(foundSet)
  }

  return result
}

/**
 * Gets exercise history - previous workouts containing a specific exercise
 */
const getExerciseHistory = async (
  db: DB,
  {
    exerciseId,
    userId,
    limit = 10,
  }: {
    exerciseId: string
    userId: string
    limit?: number
  },
) => {
  const workoutsWithExercise = await db.query.workouts.findMany({
    where: (workout) =>
      and(
        eq(workout.userId, userId),
        eq(workout.isTemplate, false),
        exists(
          db
            .select()
            .from(workoutExercises)
            .where(
              and(
                eq(workoutExercises.workoutId, workout.id),
                eq(workoutExercises.exerciseId, exerciseId),
              ),
            ),
        ),
      ),
    orderBy: [desc(workouts.startTime)],
    limit,
    with: {
      workoutExercises: {
        where: (workoutExercise) => eq(workoutExercise.exerciseId, exerciseId),
        orderBy: [workoutExercises.order],
        with: {
          sets: {
            orderBy: [exerciseSets.order],
          },
          exercise: {
            with: {
              primaryMuscleGroup: true,
            },
          },
        },
      },
    },
  })

  return workoutsWithExercise.map((workout) => ({
    id: workout.id,
    name: workout.name,
    startTime: workout.startTime,
    endTime: workout.endTime,
    workoutExercise: workout.workoutExercises[0]!,
  }))
}

/**
 * Creates or updates a workout in the database
 */
const putWorkout = async (
  db: DB,
  {
    id,
    workout,
    userId,
  }: {
    id?: string
    workout: PutWorkout
    userId: string
  },
) => {
  return await db.transaction(async (tx) => {
    // If updating an existing workout, first delete related records
    if (id) {
      const workoutExerciseResults = await tx.query.workoutExercises.findMany({
        where: (we) => eq(we.workoutId, id),
      })

      if (workoutExerciseResults.length > 0) {
        // Delete related sets first
        await Promise.all(
          workoutExerciseResults.map(async (exercise) => {
            await tx.delete(exerciseSets).where(eq(exerciseSets.workoutExerciseId, exercise.id))
          }),
        )

        // Then delete the workout exercises
        await tx.delete(workoutExercises).where(eq(workoutExercises.workoutId, id))
      }
    }

    // Prepare workout data
    const workoutData = {
      userId,
      name: workout.name,
      startTime: workout.startTime,
      endTime: workout.endTime ?? null,
      notes: workout.notes ?? null,
      isTemplate: workout.isTemplate,
      updatedAt: new Date(),
    }

    let workoutId: string

    // Insert or update workout
    if (!id) {
      const inserted = await tx
        .insert(workouts)
        .values({ ...workoutData, createdAt: new Date() })
        .returning({ id: workouts.id })

      workoutId = inserted[0].id
    } else {
      await tx.update(workouts).set(workoutData).where(eq(workouts.id, id))

      workoutId = id
    }

    // Insert workout exercises and sets
    if (workout.exercises.length > 0) {
      for (let i = 0; i < workout.exercises.length; i++) {
        const exercise = workout.exercises[i]

        // Insert workout exercise
        const insertedExercise = await tx
          .insert(workoutExercises)
          .values({
            workoutId,
            exerciseId: exercise.exerciseId,
            order: i,
            notes: exercise.notes,
            restTime: exercise.restTimeMs,
            createdAt: new Date(),
          })
          .returning({ id: workoutExercises.id })

        const workoutExerciseId = insertedExercise[0].id

        // Insert sets for this exercise
        if (exercise.sets.length > 0) {
          await tx.insert(exerciseSets).values(
            exercise.sets.map(
              (set, j) =>
                ({
                  order: j,
                  workoutExerciseId,
                  ...aDefaultExerciseSetWith(set),
                  completedAt: set.completedAt ?? undefined,
                }) satisfies {
                  [K in keyof Omit<Doc<"exerciseSets">, "id">]: Doc<"exerciseSets">[K] | undefined
                },
            ),
          )
        }
      }
    }

    return { id: workoutId }
  })
}

const deleteWorkout = async (db: DB, { id, userId }: { id: string; userId: string }) => {
  return await db.delete(workouts).where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
}

export const workoutService = {
  getWorkoutHistoryWithExercises,
  getPreviousSetMetrics,
  getExerciseHistory,
  exportUserWorkoutsAsCsv,
  importUserWorkoutsFromCsv,
  putWorkout,
  deleteWorkout,
  deleteAllUserWorkouts,
}
