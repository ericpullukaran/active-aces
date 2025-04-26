import { CircleCheck, Menu, Settings, Trash } from "lucide-react"
import { useMemo, useState } from "react"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { Skeleton } from "~/components/ui/skeleton"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

export function WorkoutExerciseHeader({
  exercise,
  collapseExercise,
  deleteExercise,
}: {
  exercise: WorkoutExerciseWithMetadata
  collapseExercise: () => void
  deleteExercise: () => void
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const completedSets = useMemo(
    () => exercise.sets.reduce((acc, set) => acc + (set.completed ? 1 : 0), 0),
    [exercise.sets],
  )

  const totalSets = exercise.sets.length

  const allSetsComplete = totalSets > 0 && completedSets === totalSets

  return (
    <div className="relative">
      <div
        onClick={collapseExercise}
        className="ring-card shadow-accent-foreground/15 flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-md ring-4 active:scale-[0.99]"
        role="button"
        tabIndex={0}
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
      </div>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            scalingOnClick
            onClick={(e) => {
              e.stopPropagation()
              setIsPopoverOpen(!isPopoverOpen)
            }}
            variant="outline"
            size="icon-sm"
            className="absolute top-1/4 right-3"
            Icon={Menu}
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 py-2">
          <Button onClick={deleteExercise} variant="destructive" Icon={Trash} className="w-full">
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}
