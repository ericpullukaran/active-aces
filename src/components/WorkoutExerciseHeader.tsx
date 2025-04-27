import {
  CircleCheck,
  CircleCheckBigIcon,
  CircleDashed,
  Menu,
  NotepadText,
  Trash,
} from "lucide-react"
import { useMemo, useState } from "react"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { Skeleton } from "~/components/ui/skeleton"
import { Button } from "./ui/button"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import ExerciseNotesDialog from "./ExerciseNotesDialog"
import { MeasurementType } from "~/lib/db/types"

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
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const { updateExerciseSettings } = useWorkoutManager()
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

      {/* External Exercise Notes Dialog */}
      <ExerciseNotesDialog
        exerciseId={exercise.stableExerciseId}
        initialNotes={exercise.notes || ""}
        isOpen={showNotesDialog}
        onClose={() => setShowNotesDialog(false)}
      />

      <DropdownMenu open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {exercise.metadata.measurementType === MeasurementType.WEIGHT_REPS && (
            <DropdownMenuItem
              className="flex items-center px-2 py-1.5"
              variant={exercise.enableAssistedReps ? "selected" : "default"}
              onClick={() =>
                updateExerciseSettings(exercise.stableExerciseId, {
                  enableAssistedReps: !exercise.enableAssistedReps,
                })
              }
            >
              {!exercise.enableAssistedReps && <CircleDashed className="mr-2 h-4 w-4" />}
              {exercise.enableAssistedReps && <CircleCheckBigIcon className="mr-2 h-4 w-4" />}
              {exercise.enableAssistedReps ? "Assisted reps" : "Enable assisted reps"}
            </DropdownMenuItem>
          )}
          {exercise.metadata.measurementType === MeasurementType.REPS && (
            <DropdownMenuItem
              className="flex items-center px-2 py-1.5"
              variant={exercise.enableWeightedReps ? "selected" : "default"}
              onClick={() =>
                updateExerciseSettings(exercise.stableExerciseId, {
                  enableWeightedReps: !exercise.enableWeightedReps,
                })
              }
            >
              {!exercise.enableWeightedReps && <CircleDashed className="mr-2 h-4 w-4" />}
              {exercise.enableWeightedReps && <CircleCheckBigIcon className="mr-2 h-4 w-4" />}
              {exercise.enableWeightedReps ? "Weighted reps" : "Enable Weighted reps"}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="flex items-center px-2 py-1.5"
            onClick={() => {
              setIsPopoverOpen(false)
              setShowNotesDialog(true)
            }}
          >
            <NotepadText className="mr-2 h-4 w-4" />
            {exercise.notes ? "Edit notes" : "Add notes"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={deleteExercise}>
            <Trash className="mr-2 h-4 w-4" />
            Delete Exercise
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
