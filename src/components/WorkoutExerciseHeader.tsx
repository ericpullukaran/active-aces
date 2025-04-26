import { CircleCheck, Settings } from "lucide-react"
import { useMemo } from "react"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { Skeleton } from "~/components/ui/skeleton"

export function WorkoutExerciseHeader({
  exercise,
  collapseExercise,
}: {
  exercise: WorkoutExerciseWithMetadata
  collapseExercise: () => void
}) {
  const completedSets = useMemo(
    () => exercise.sets.reduce((acc, set) => acc + (set.completed ? 1 : 0), 0),
    [exercise.sets],
  )

  const totalSets = exercise.sets.length

  const allSetsComplete = totalSets > 0 && completedSets === totalSets

  return (
    <div
      onClick={collapseExercise}
      className="ring-card shadow-accent-foreground/15 flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-md ring-4 active:scale-[0.99]"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          collapseExercise()
          event.preventDefault()
        }
      }}
    >
      <div>
        {exercise.metadata.name || <Skeleton className="h-6 w-20" />}
        <div>
          <p className="flex items-center text-sm text-zinc-400">
            {allSetsComplete ? (
              <>
                <CircleCheck className="fill-primary text-card mr-1 h-4 w-4" />
                <span>All sets complete</span>
              </>
            ) : (
              <>{`${completedSets}/${totalSets} sets`}</>
            )}
          </p>
        </div>
      </div>
      <Settings className="h-5 w-5 text-zinc-400" />
    </div>
  )
}
