import { formatTimeValue } from "~/lib/utils/dates"
import { parseTimeToSeconds } from "~/lib/utils/dates"
import { TimeInput } from "./ui/time-input"
import { cn } from "~/lib/utils"
import { Button } from "./ui/button"
import { Play } from "lucide-react"
import { type ExerciseSet, type WorkoutExercise } from "~/lib/types/workout"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

type Props = {
  set: ExerciseSet
  exercise: WorkoutExercise
}

export function WorkoutExerciseWidgetTimeInput({ set, exercise }: Props) {
  const { updateSet, startStopwatch, activeStopwatchSetInfo: activeSetInfo } = useWorkoutManager()

  const isActiveSet =
    activeSetInfo &&
    activeSetInfo.exerciseId === exercise.stableExerciseId &&
    activeSetInfo.setId === set.stableSetId

  const isThisSetActive = !!isActiveSet

  return (
    <div className="relative flex items-center gap-1">
      {set.completed !== undefined && set.completed !== true && (
        <Button
          size="icon"
          variant="outline"
          className={cn("h-8", !!isActiveSet ? "border-primary" : "border-zinc-400")}
          disabled={!!isActiveSet}
          onClick={(e) => {
            e.stopPropagation()
            if (!isActiveSet) {
              startStopwatch({
                exerciseId: exercise.stableExerciseId,
                setId: set.stableSetId,
                initialSeconds: set.time,
              })
            }
          }}
        >
          <Play size={20} className={cn(!!isActiveSet ? "text-primary" : "text-zinc-400")} />
        </Button>
      )}
      <TimeInput
        disabled={set.completed || isThisSetActive}
        className={cn(
          "w-full rounded-md border-none bg-transparent p-2 text-center focus:ring-transparent",
        )}
        onFocus={(event) => event.target.select()}
        value={set["time"] ? formatTimeValue(set["time"]) : ""}
        onBlur={(value) => {
          const seconds = parseTimeToSeconds(value)
          updateSet(exercise.stableExerciseId, set.stableSetId, {
            time: seconds,
          })
        }}
      />
    </div>
  )
}
