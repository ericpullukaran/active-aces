import { ExercisesList } from "../ExercisesList"

export default function ExercisesScreen() {
  return (
    <div className="relative flex flex-col items-center gap-8 pt-10 pb-32">
      <h1 className="text-2xl font-bold">Exercises</h1>
      <ExercisesList />
    </div>
  )
}
