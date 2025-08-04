import { type ReactNode, useState, useCallback } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { getTimeOfDay, formatTimeValue, parseTimeToSeconds } from "~/lib/utils/dates"
import { Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenuItem } from "./ui/dropdown-menu"
import { CopyPlus } from "lucide-react"
import CreateTemplateDialog from "./CreateTemplateDialog"
import { TimeInput } from "./ui/time-input"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { navigationActions } from "~/lib/stores/navigationStore"
import { useIsWorkoutActive } from "~/lib/utils/useIsWorkoutActive"
import { trackWorkout } from "~/lib/utils/analytics"

export default function EndWorkoutDialog({
  children,
}: {
  children: (props: { openDialog: () => void }) => ReactNode
}) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const putWorkoutMutation = useMutation(
    trpc.workouts.put.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.workouts.history.pathKey(),
          refetchType: "all",
        })
        workoutActions.removeCurrentWorkout()
        navigationActions.setCurrentPage("home")
      },
    }),
  )
  const [note, setNote] = useState("")
  const [title, setTitle] = useState("")
  const isWorkoutActive = useIsWorkoutActive()
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showCreateTemplateConfirmation, setShowCreateTemplateConfirmation] = useState(false)
  const [durationSeconds, setDurationSeconds] = useState(0)

  const calculateCurrentDuration = useCallback(() => {
    if (workoutStore.currentWorkout?.startTime) {
      const startTime = new Date(workoutStore.currentWorkout.startTime)
      const currentDurationSeconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      return Math.max(1, currentDurationSeconds)
    }
    return 0
  }, [])
  const handleDurationChange = (value: string) => {
    const parsedSeconds = parseTimeToSeconds(value)
    if (workoutStore.currentWorkout?.startTime) {
      const maxDurationSeconds = calculateCurrentDuration()
      const constrainedDuration = Math.min(Math.max(1, parsedSeconds), maxDurationSeconds)
      setDurationSeconds(constrainedDuration)
    }
  }

  const deleteWorkout = (closeDialog: () => void) => {
    if (isWorkoutActive) {
      trackWorkout.deleted({
        workout_name: workoutStore.currentWorkout?.name,
        exercise_count: workoutStore.currentWorkout?.exercises.length,
        duration_seconds: calculateCurrentDuration(),
      })

      workoutActions.removeCurrentWorkout()
      navigationActions.setCurrentPage("home")
    }
    closeDialog()
    setShowDeleteConfirmation(false)
  }

  const endWorkout = (closeDialog: () => void) => {
    if (workoutStore.currentWorkout) {
      const exerciseCount = workoutStore.currentWorkout.exercises.length
      const workoutName = workoutStore.currentWorkout.name
      const finalEndTime = new Date(
        workoutStore.currentWorkout.startTime.getTime() + durationSeconds * 1000,
      )
      putWorkoutMutation.mutate(
        {
          workout: {
            ...workoutStore.currentWorkout,
            endTime: finalEndTime,
            ...(title !== "" && { name: title }),
            ...(note !== "" && { notes: note }),
          },
        },
        {
          onSuccess: () => {
            console.warn("Tracking workout ended")
            trackWorkout.ended({
              workout_name: workoutName || title,
              exercise_count: exerciseCount,
              duration_seconds: durationSeconds,
              is_template: false,
            })

            setTitle("")
            setNote("")
            closeDialog()
          },
        },
      )
    }
  }

  return (
    <>
      <ResponsiveDialog
        title="End Workout"
        renderTrigger={({ openDialog }) => {
          return children({
            openDialog: () => {
              setDurationSeconds(calculateCurrentDuration())
              openDialog()
            },
          })
        }}
        headerAction={({ closeDialog }) => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button scalingOnClick variant="outline" size="icon-sm" Icon={Menu} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  closeDialog()
                  setShowCreateTemplateConfirmation(true)
                }}
              >
                <CopyPlus className="mr-2 h-4 w-4" />
                Make template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        renderContent={() => (
          <div className="flex flex-col gap-4 px-4">
            <div>
              <p className="mb-2 text-sm font-medium">Workout Title</p>
              <Input
                placeholder={`${getTimeOfDay()} Workout`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">Workout Duration</p>
              <TimeInput value={formatTimeValue(durationSeconds)} onBlur={handleDurationChange} />
            </div>
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
                  variant={"destructive"}
                  disabled={putWorkoutMutation.isPending}
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="flex-1 text-nowrap"
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
      {/* Create template dialog */}
      <CreateTemplateDialog
        open={showCreateTemplateConfirmation}
        onOpenChange={setShowCreateTemplateConfirmation}
        workout={workoutStore.currentWorkout}
      />
    </>
  )
}
