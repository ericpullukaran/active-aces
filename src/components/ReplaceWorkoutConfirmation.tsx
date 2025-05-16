import { Button } from "./ui/button"
import { DialogFooter, DialogContent, DialogHeader, Dialog } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

export default function ReplaceWorkoutConfirmation({
  open,
  onOpenChange,
  workout,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: WorkoutHistoryExercise
}) {
  const { forceCopyWorkout } = useWorkoutManager()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workout already in progress</DialogTitle>
          <DialogDescription>
            Are you sure you want to use this workout? Your current workout will be replaced and any
            unsaved progress will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => forceCopyWorkout(workout)}>
            Replace Workout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
