import { ReactNode, useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Textarea } from "./ui/textarea"

export default function EndWorkoutDialog({
  children,
}: {
  children: (props: { openDialog: () => void }) => ReactNode
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const putWorkoutMutation = useMutation(trpc.workouts.put.mutationOptions())
  const [note, setNote] = useState("")
  const { currentWorkout, removeCurrentWorkout, setCurrentPage, addWorkoutNote } =
    useWorkoutManager()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const deleteWorkout = (closeDialog: () => void) => {
    if (currentWorkout) {
      removeCurrentWorkout()
      setCurrentPage("home")
    }
    closeDialog()
    setShowDeleteConfirmation(false)
  }

  const endWorkout = (closeDialog: () => void) => {
    if (currentWorkout) {
      putWorkoutMutation.mutate(
        {
          workout: { ...currentWorkout, endTime: new Date(), ...(note !== "" && { notes: note }) },
        },
        {
          onSuccess: () => {
            removeCurrentWorkout()
            setNote("")
            closeDialog()
            setCurrentPage("home")
            queryClient.invalidateQueries({
              queryKey: trpc.workouts.historyInfinite.infiniteQueryKey(),
            })
          },
        },
      )
    }
  }

  return (
    <>
      <ResponsiveDialog
        title="End Workout"
        renderTrigger={({ openDialog }) => children({ openDialog })}
        renderContent={({ closeDialog }) => (
          <div className="flex flex-col gap-4 px-4">
            <div>
              <p className="mb-2 text-sm font-medium">Workout Notes</p>
              <Textarea
                maxLength={500}
                placeholder="How was your workout today? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className="flex gap-4">
            <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
              <DialogTrigger asChild>
                <Button
                  variant={"outline"}
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="text-destructive border-destructive flex-1"
                >
                  Delete Workout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Workout</DialogTitle>
                </DialogHeader>
                <div className="py-3">
                  <p>Are you sure you want to delete this workout? This action cannot be undone.</p>
                </div>
                <DialogFooter className="flex gap-4 sm:justify-start">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => deleteWorkout(closeDialog)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="default"
              isLoading={putWorkoutMutation.isPending}
              onClick={() => endWorkout(closeDialog)}
              className="flex-1"
            >
              End Workout
            </Button>
          </div>
        )}
      />
    </>
  )
}
