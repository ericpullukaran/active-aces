import { DbExercise, DbExercisesMap } from "~/lib/types/workout"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import MuscleGroupBadge from "./MuscleGroupBadge"
import { Dumbbell, Clock } from "lucide-react"
import { cn } from "~/lib/utils"
import { MeasurementTypeLabels } from "~/lib/utils/measurement"
import { Button } from "./ui/button"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Dialog } from "./ui/dialog"
import { useState } from "react"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { exerciseQueryKey } from "~/lib/utils/useExercises"

type ExerciseDialogSummaryProps = {
  isOpen: boolean
  onClose: () => void
  exercise: DbExercise
}

export function ExerciseDialogSummary({ isOpen, onClose, exercise }: ExerciseDialogSummaryProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteExerciseMutation = useMutation(
    trpc.exercises.delete.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData([exerciseQueryKey], (data: DbExercisesMap) => {
          if (!data) return new Map().set(exercise.id, { ...exercise, deleted: true })
          const newData = new Map(data)
          newData.set(exercise.id, { ...exercise, deleted: true })
          return newData
        })
        setShowDeleteDialog(false)
        onClose()
      },
    }),
  )

  const confirmDelete = () => {
    deleteExerciseMutation.mutate({ exerciseId: exercise.id })
  }
  return (
    <>
      <ResponsiveDialog
        title={exercise.name}
        isOpen={isOpen}
        onClose={onClose}
        renderContent={() => (
          <div className="flex flex-col space-y-6 px-4">
            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-foreground text-sm font-medium">Description</h3>
              <p className="text-muted-foreground text-sm">
                {exercise.description ?? "No description"}
              </p>
            </div>

            {/* Muscle groups section */}
            <div className="space-y-2">
              <h3 className="text-foreground text-sm font-medium">Muscle Groups</h3>
              <div className="flex flex-col gap-2">
                {!exercise.primaryMuscleGroup &&
                  (!exercise.exerciseMuscleGroups || exercise.exerciseMuscleGroups.length < 0) && (
                    <p className="text-muted-foreground text-sm">No muscle groups specified</p>
                  )}
                {exercise.primaryMuscleGroup && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-16 text-xs">Primary:</span>
                    <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup.name} />
                  </div>
                )}

                {exercise.exerciseMuscleGroups?.length > 0 && (
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-1 w-16 text-xs">Secondary:</span>
                    <div className="flex flex-wrap gap-2">
                      {exercise.exerciseMuscleGroups.map((group) => (
                        <MuscleGroupBadge
                          key={group.muscleGroup.id}
                          muscleGroup={group.muscleGroup.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Exercise details */}
            <div className="grid grid-cols-2 gap-4">
              {/* Measurement type */}
              <div className="space-y-1.5">
                <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                  <Dumbbell className="h-4 w-4" />
                  <h3>Measurement</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {MeasurementTypeLabels[exercise.measurementType]}
                </p>
              </div>

              {/* Rest time if available */}
              <div className="space-y-1.5">
                <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <h3>Default Rest</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {exercise.defaultRestTime
                    ? `${Math.floor(exercise.defaultRestTime / 1000)} seconds`
                    : "Not specified"}
                </p>
              </div>
            </div>

            {/* Creator information if available */}
            {exercise.creatorId && (
              <div className="space-y-1.5 border-t pt-2">
                <h3 className="text-muted-foreground text-xs">Custom Exercise</h3>
                <p className="flex items-center text-sm">
                  <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
                    Created by you
                  </span>
                </p>
              </div>
            )}
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className={cn("flex w-full justify-end gap-2")}>
            {exercise.creatorId && (
              <Button
                variant="destructiveOutline"
                className="flex-1"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete
              </Button>
            )}
            <Button variant={"outline"} className="flex-1" onClick={() => closeDialog()}>
              Close
            </Button>
          </div>
        )}
      />
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Delete Exercise</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this custom exercise? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteExerciseMutation.isPending}
              className="flex-1"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
