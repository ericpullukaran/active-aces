import { DB, orderBy, schema } from "../db"
import { Exercise } from "../types/workout"

const getAllExercises = async (db: DB): Promise<Exercise[]> => {
  const exercises = await db.query.exercises.findMany({
    orderBy: [orderBy.asc(schema.exercises.name)],
    with: {
      primaryMuscleGroup: true,
    },
  })
  return exercises.map((exercise) => ({
    ...exercise,
    primaryMuscleGroup: exercise.primaryMuscleGroup ?? undefined,
  }))
}

export const exercisesService = {
  getAllExercises,
}
