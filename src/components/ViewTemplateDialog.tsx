"use client"

import React, { useState } from "react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Menu, Trash } from "lucide-react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import { extractMuscleGroups } from "~/lib/utils/workout-helpers"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { templatesQueryKey } from "./TemplatesCarousel"
import ReplaceWorkoutConfirmation from "./ReplaceWorkoutConfirmation"

interface ViewTemplateDialogProps {
  template: WorkoutHistoryExercise
  children?: React.ReactNode
}

export default function ViewTemplateDialog({ template, children }: ViewTemplateDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { maybeCopyWorkout } = useWorkoutManager()
  const [isOpen, setIsOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showUseTemplateConfirmation, setShowUseTemplateConfirmation] = useState(false)
  const deleteTemplateMutation = useMutation(
    trpc.workouts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [templatesQueryKey] })
      },
    }),
  )

  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(template), [template])

  const confirmDelete = () => {
    deleteTemplateMutation.mutate(
      { id: template.id },
      {
        onSuccess: () => {
          setShowDeleteDialog(false)
          setIsOpen(false)
        },
      },
    )
  }

  // Group exercises by primary muscle group
  const exercisesByMuscleGroup = React.useMemo(() => {
    const grouped = new Map<string, { exercise: any; setCount: number }[]>()

    template.workoutExercises.forEach((exerciseData) => {
      const muscleGroupName = exerciseData.exercise.primaryMuscleGroup?.name || "Other"
      if (!grouped.has(muscleGroupName)) {
        grouped.set(muscleGroupName, [])
      }
      grouped.get(muscleGroupName)?.push({
        exercise: exerciseData.exercise,
        setCount: exerciseData.sets.length,
      })
    })

    return grouped
  }, [template.workoutExercises])

  return (
    <>
      <ResponsiveDialog
        title={template.name}
        description="Workout Template"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        headerAction={() => (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button scalingOnClick variant="outline" size="icon-sm" Icon={Menu} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete Template
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

            {/* Exercises */}
            <div className="mt-2 space-y-4">
              <h3 className="text-lg font-medium">Exercises</h3>

              {Array.from(exercisesByMuscleGroup.entries()).map(([muscleGroup, exercises]) => (
                <div key={muscleGroup} className="space-y-2">
                  <h4 className="text-primary text-sm font-medium">{muscleGroup}</h4>

                  {exercises.map((item, idx) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{item.exercise.name}</div>
                        <div className="text-muted-foreground text-sm">
                          {item.setCount} set{item.setCount !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className="flex gap-2">
            <Button variant="outline" onClick={closeDialog} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                if (maybeCopyWorkout(template)) {
                  closeDialog()
                } else {
                  setShowUseTemplateConfirmation(true)
                }
              }}
              className="flex-1"
            >
              Use Template
            </Button>
          </div>
        )}
      />
      {/* Use template confirmation dialog */}
      <ReplaceWorkoutConfirmation
        open={showUseTemplateConfirmation}
        onOpenChange={setShowUseTemplateConfirmation}
        workout={template}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteTemplateMutation.isPending}
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
