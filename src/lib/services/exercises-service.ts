import { DB, orderBy, schema } from "../db"
import { DbExercisesMap } from "../types/workout"

const getAllExercises = async (db: DB): Promise<DbExercisesMap> => {
  const exercises = await db.query.exercises.findMany({
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

export const exercisesService = {
  getAllExercises,
}
