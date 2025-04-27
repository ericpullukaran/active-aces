import { cmp, DB, orderBy, schema } from "../db"
import { DbExercisesMap } from "../types/workout"
import { exercises, muscleGroups } from "../db/schema"
import { MeasurementType } from "../db/types"

const getAllExercises = async (db: DB, userId: string): Promise<DbExercisesMap> => {
  const exercises = await db.query.exercises.findMany({
    where: cmp.or(
      cmp.isNull(schema.exercises.creatorId),
      cmp.eq(schema.exercises.creatorId, userId),
    ),
    orderBy: [orderBy.asc(schema.exercises.name)],
    with: {
      primaryMuscleGroup: true,
    },
  })
  return exercises.reduce((acc, exercise) => {
    acc.set(exercise.id, exercise)
    return acc
  }, new Map() as DbExercisesMap)
}

const getAllMuscleGroups = async (db: DB) => {
  return await db.query.muscleGroups.findMany({
    orderBy: [orderBy.asc(schema.muscleGroups.name)],
  })
}

const createExercise = async (
  db: DB,
  {
    name,
    description,
    measurementType,
    primaryMuscleGroupId,
    creatorId,
  }: {
    name: string
    description?: string
    measurementType: MeasurementType
    primaryMuscleGroupId?: string
    creatorId: string
  },
) => {
  const [exercise] = await db
    .insert(exercises)
    .values({
      name,
      description,
      measurementType,
      primaryMuscleGroupId,
      creatorId,
      createdAt: new Date(),
    })
    .returning()

  // Get the exercise with the primary muscle group
  const exerciseWithRelations = await db.query.exercises.findFirst({
    where: cmp.eq(schema.exercises.id, exercise.id),
    with: {
      primaryMuscleGroup: true,
    },
  })

  return exerciseWithRelations
}

export const exercisesService = {
  getAllExercises,
  getAllMuscleGroups,
  createExercise,
}
