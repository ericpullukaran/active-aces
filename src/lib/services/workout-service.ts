import { and, desc, eq, lt } from "drizzle-orm"
import { DB } from "../db"
import { PutWorkout } from "../types/workout"
import { exerciseSets, workoutExercises, workouts } from "../db/schema"

const getWorkoutHistory = async (
  db: DB,
  { userId, limit = 3 }: { userId: string; limit?: number },
) => {
  const workoutResults = await db.query.workouts.findMany({
    where: (workouts) => eq(workouts.userId, userId),
    orderBy: [desc(workouts.createdAt)],
    limit,
  })
  return workoutResults
}

/**
 * Retrieves paginated workout history with exercises and muscle groups
 */
const getWorkoutHistoryWithExercises = async (
  db: DB,
  { userId, limit = 10, cursor }: { userId: string; limit?: number; cursor?: string },
) => {
  // Get workouts by user ID, ordered by creation date
  let query = db.query.workouts.findMany({
    where: (workout) => eq(workout.userId, userId),
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
      where: (workout) => eq(workout.id, cursor),
    })

    if (cursorWorkout) {
      // Update the query with the cursor filter
      query = db.query.workouts.findMany({
        where: (workout) =>
          and(eq(workout.userId, userId), lt(workout.createdAt, cursorWorkout.createdAt)),
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
      endTime: workout.endTime,
      notes: workout.notes,
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
            restTime: exercise.restTimeSeconds,
            createdAt: new Date(),
          })
          .returning({ id: workoutExercises.id })

        const workoutExerciseId = insertedExercise[0].id

        // Insert sets for this exercise
        if (exercise.sets.length > 0) {
          await tx.insert(exerciseSets).values(
            exercise.sets.map((set, j) => ({
              workoutExerciseId,
              order: set.order ?? j,
              weight: set.weight,
              reps: set.reps,
              ...(set.assistedReps && set.assistedReps > 0 && { assistedReps: set.assistedReps }),
              distance: set.distance,
              time: set.time,
              completed: set.completed ?? false,
              completedAt: set.completedAt,
            })),
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
  getWorkoutHistory,
  getWorkoutHistoryWithExercises,
  putWorkout,
  deleteWorkout,
}
