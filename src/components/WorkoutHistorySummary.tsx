"use client"

import React, { useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MeasurementType } from "~/lib/db/types"
import { MEASUREMENT_FIELDS, getFieldKeys, formatSetValue } from "~/lib/utils/measurement"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import {
  extractMuscleGroups,
  formatWorkoutDate,
  calculateWorkoutDuration,
} from "~/lib/utils/workout-helpers"
import { CopyPlus, Trash } from "lucide-react"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { DropdownMenuTrigger } from "./ui/dropdown-menu"
import { DropdownMenu } from "./ui/dropdown-menu"
import { Menu } from "lucide-react"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { historyQueryKey } from "./dashboard-screen/HistoryScreen"
import { recentWorkoutsQueryKey } from "./RecentWorkoutsCard"

type WorkoutSummaryProps = {
  workout: WorkoutHistoryExercise
  children: React.ReactNode
}

export default function WorkoutHistorySummary({ workout, children }: WorkoutSummaryProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { maybeCopyWorkout, forceCopyWorkout } = useWorkoutManager()
  const [showCopyConfirmation, setShowCopyConfirmation] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteWorkoutMutation = useMutation(
    trpc.workouts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [historyQueryKey] })
        queryClient.invalidateQueries({ queryKey: [recentWorkoutsQueryKey] })
      },
    }),
  )
  const formattedDate = React.useMemo(
    () => formatWorkoutDate(workout.startTime, "MMMM d, yyyy 'at' h:mm a"),
    [workout.startTime],
  )

  const duration = React.useMemo(
    () => calculateWorkoutDuration(workout.startTime, workout.endTime),
    [workout.startTime, workout.endTime],
  )

  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(workout), [workout])

  const confirmDelete = () => {
    deleteWorkoutMutation.mutate(
      { id: workout.id },
      { onSuccess: () => setShowDeleteDialog(false) },
    )
  }

  return (
    <>
      <ResponsiveDialog
        title={workout.name}
        description={`${formattedDate}`}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        headerAction={() => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button scalingOnClick variant="outline" size="icon-sm" Icon={Menu} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  if (!maybeCopyWorkout(workout)) {
                    setShowCopyConfirmation(true)
                  }
                }}
              >
                <CopyPlus className="mr-2 h-4 w-4" />
                Copy workout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Workout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        renderTrigger={() => (
          <div onClick={() => setIsOpen(true)} className="cursor-pointer">
            {children}
          </div>
        )}
        renderContent={() => (
          <div className="flex flex-col gap-4 p-4">
            {/* Duration */}
            {duration && (
              <div className="flex gap-2">
                <h3 className="text-sm font-medium">Duration:</h3>
                <p className="text-muted-foreground text-sm">{duration}</p>
              </div>
            )}
            {/* Muscle groups */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Muscle Groups</h3>
              {allMuscleGroups.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {allMuscleGroups.map((group) => (
                    <Badge key={group} variant="outline" className="bg-primary/10">
                      {group}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes if available */}
            {workout.notes && (
              <div className="mt-2">
                <h3 className="mb-1 text-sm font-medium">Notes</h3>
                <p className="text-muted-foreground text-sm">{workout.notes}</p>
              </div>
            )}

            {/* Exercises */}
            <div className="mt-2 space-y-4">
              <h3 className="text-lg font-medium">Exercises</h3>
              {workout.workoutExercises.map((exerciseData, idx) => {
                const { exercise, sets = [], notes } = exerciseData
                const hasAssistedReps = sets.some((set) => set.assistedReps)
                const hasWeightedReps = sets.some((set) => set.weight != null)
                const measurementType = exercise.measurementType || MeasurementType.WEIGHT_REPS
                const fieldKeys = getFieldKeys(measurementType, {
                  enableAssistedReps: hasAssistedReps,
                  enableWeightedReps: hasWeightedReps,
                })

                return (
                  <div key={idx} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium">{exercise.name}</h4>
                      {exercise.primaryMuscleGroup && (
                        <Badge variant="outline" className="bg-primary/5">
                          {exercise.primaryMuscleGroup.name}
                        </Badge>
                      )}
                    </div>

                    {sets.length > 0 ? (
                      <div className="mt-2">
                        {/* Header row with field names */}
                        <div
                          className="text-muted-foreground mb-1 grid gap-2 text-sm"
                          style={{
                            gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")}`,
                          }}
                        >
                          <div>Set</div>
                          {fieldKeys.map((field) => (
                            <div key={field}>{MEASUREMENT_FIELDS[field].label}</div>
                          ))}
                        </div>

                        {/* Set rows */}
                        {sets.map((set, setIdx) => (
                          <div
                            key={setIdx}
                            className={`grid gap-2 py-1 text-sm ${!set.completed ? "text-muted-foreground" : ""}`}
                            style={{
                              gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")}`,
                            }}
                          >
                            <div>{setIdx + 1}</div>
                            {fieldKeys.map((field) => (
                              <div key={field}>{formatSetValue(set, field)}</div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No sets recorded</p>
                    )}

                    {/* Exercise notes if available */}
                    {notes && (
                      <div className="mt-2 text-sm">
                        <p className="text-muted-foreground">{notes}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeDialog} className="flex-1">
              Close
            </Button>
          </div>
        )}
      />
      {/* Copy workout confirmation dialog */}
      <Dialog open={showCopyConfirmation} onOpenChange={setShowCopyConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Copy Workout</DialogTitle>
            <DialogDescription>
              Copy this workout? This will replace your current workout.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCopyConfirmation(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => forceCopyWorkout(workout)}>
              Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Delete Workout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this workout? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteWorkoutMutation.isPending}
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
