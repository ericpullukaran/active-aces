import { Badge } from "~/components/ui/badge"
import { DbExercise } from "~/lib/types/workout"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { DrawerClose } from "./ui/drawer"

export function ExerciseCard({ exercise }: { exercise: DbExercise }) {
  const { addExercise } = useWorkoutManager()

  return (
    <DrawerClose
      onClick={() => addExercise(exercise.id)}
      className="hover:border-primary flex items-center space-x-4 rounded-md border p-4 text-left transition-all"
    >
      <div className="h-10 w-10 rounded-lg bg-red-400"></div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <p className="flex-1 text-sm leading-none font-medium">{exercise.name}</p>
          {exercise.primaryMuscleGroup && (
            <Badge className="px-2" variant={"outline"}>
              {exercise.primaryMuscleGroup.name}
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">{exercise.description}</p>
      </div>
    </DrawerClose>
  )
}
