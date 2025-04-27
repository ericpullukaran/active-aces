import { Badge } from "~/components/ui/badge"
import { DbExercise } from "~/lib/types/workout"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { DrawerClose } from "./ui/drawer"
import { DialogClose } from "./ui/dialog"
import { MOBILE_VIEWPORT } from "~/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"

export function ExerciseCard({
  inWorkout,
  exercise,
}: {
  inWorkout: boolean
  exercise: DbExercise
}) {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)
  const { addExercise } = useWorkoutManager()
  const Component = inWorkout ? (isMobile ? DrawerClose : DialogClose) : "div"

  return (
    <Component
      onClick={inWorkout ? () => addExercise(exercise.id) : undefined}
      className="hover:border-primary flex items-center space-x-4 rounded-xl border p-4 text-left transition-all"
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
    </Component>
  )
}
