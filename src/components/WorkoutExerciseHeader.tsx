import {
  CircleCheck,
  CircleCheckBigIcon,
  CircleDashed,
  Menu,
  NotepadText,
  Timer,
  Trash,
  History,
} from "lucide-react"
import { useMemo, useState } from "react"
import { type WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { Skeleton } from "~/components/ui/skeleton"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import ExerciseNotesDialog from "./ExerciseNotesDialog"
import { MeasurementType } from "~/lib/db/types"
import CustomizeTimerDialog from "./CustomizeTimerDialog"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"
import { AnimatePresence, motion } from "motion/react"

export function WorkoutExerciseHeader({
  exercise,
  collapseExercise,
  isPrefilling,
}: {
  exercise: WorkoutExerciseWithMetadata
  collapseExercise: () => void
  isPrefilling?: boolean
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showTimerDialog, setShowTimerDialog] = useState(false)
  const snap = useSnapshot(workoutStore)
  const observableExercise = snap.currentWorkout?.exercises.find(
    (ex) => ex.stableExerciseId === exercise.stableExerciseId,
  )

  const completedSets = useMemo(
    () => observableExercise?.sets.reduce((acc, set) => acc + (set.completed ? 1 : 0), 0),
    [observableExercise?.sets],
  )
  const totalSets = observableExercise?.sets.length || 0

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
          <div className={"text-muted-foreground flex items-center gap-2 text-sm"}>
            <p className="flex items-center">
              {allSetsComplete ? (
                <>
                  <CircleCheck className="fill-primary text-card mr-1 h-4 w-4" />
                  <span>{totalSets} sets complete</span>
                </>
              ) : (
                <>{`${completedSets}/${totalSets} sets`}</>
              )}
            </p>
            <AnimatePresence>
              {isPrefilling && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="flex items-center">
                    <History className="mr-1 h-3 w-3" />
                    Prefilling...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

      {/* External Exercise Timer Dialog */}
      <CustomizeTimerDialog
        exerciseId={exercise.stableExerciseId}
        initialTimer={exercise.metadata.defaultRestTime}
        isOpen={showTimerDialog}
        onClose={() => setShowTimerDialog(false)}
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
              className="flex items-center px-2"
              variant={observableExercise?.enableAssistedReps ? "selected" : "default"}
              onClick={() =>
                workoutActions.updateExerciseAssistedReps(
                  exercise.stableExerciseId,
                  !observableExercise?.enableAssistedReps,
                )
              }
            >
              {!observableExercise?.enableAssistedReps && <CircleDashed className="mr-2 h-4 w-4" />}
              {observableExercise?.enableAssistedReps && (
                <CircleCheckBigIcon className="mr-2 h-4 w-4" />
              )}
              {observableExercise?.enableAssistedReps ? "Assisted reps" : "Enable assisted reps"}
            </DropdownMenuItem>
          )}
          {exercise.metadata.measurementType === MeasurementType.REPS && (
            <DropdownMenuItem
              className="flex items-center px-2"
              variant={observableExercise?.enableWeightedReps ? "selected" : "default"}
              onClick={() =>
                workoutActions.updateExerciseWeightedReps(
                  exercise.stableExerciseId,
                  !observableExercise?.enableWeightedReps,
                )
              }
            >
              {!observableExercise?.enableWeightedReps && <CircleDashed className="mr-2 h-4 w-4" />}
              {observableExercise?.enableWeightedReps && (
                <CircleCheckBigIcon className="mr-2 h-4 w-4" />
              )}
              {observableExercise?.enableWeightedReps ? "Weighted reps" : "Enable Weighted reps"}
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            className="flex items-center px-2"
            onClick={() => {
              setIsPopoverOpen(false)
              setShowNotesDialog(true)
            }}
          >
            <NotepadText className="mr-2 h-4 w-4" />
            {observableExercise?.notes ? "Edit notes" : "Add notes"}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center px-2"
            onClick={() => {
              setIsPopoverOpen(false)
              setShowTimerDialog(true)
            }}
          >
            <Timer className="mr-2 h-4 w-4" />
            Customize timer
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => workoutActions.deleteExercise(exercise.stableExerciseId)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Exercise
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
