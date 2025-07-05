import { type DbExercise } from "~/lib/types/workout"
import { DrawerClose } from "./ui/drawer"
import { DialogClose } from "./ui/dialog"
import { MOBILE_VIEWPORT } from "~/lib/utils"
import { useMediaQuery } from "@react-hook/media-query"
import MuscleGroupBadge from "./MuscleGroupBadge"

export function ExerciseCard({
  inWorkout,
  exercise,
  onClick,
}: {
  inWorkout: boolean
  exercise: DbExercise
  onClick: () => void
}) {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)
  const Component = inWorkout ? (isMobile ? DrawerClose : DialogClose) : "div"

  return (
    <Component
      onClick={onClick}
      className="hover:border-primary bg-card flex items-center space-x-4 rounded-xl border p-4 text-left transition-all"
    >
      <div className="flex-1 flex-col space-y-2">
        <div className="flex items-center">
          <p className="flex-1 text-sm leading-none font-medium">{exercise.name}</p>
          {exercise.primaryMuscleGroup && (
            <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup.name} />
          )}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">{exercise.description}</p>
      </div>
    </Component>
  )
}
