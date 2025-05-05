"use client"

import React, { useState } from "react"
import WorkoutHistorySummary from "./WorkoutHistorySummary"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import { extractMuscleGroups, formatWorkoutDate } from "~/lib/utils/workout-helpers"
import { Menu, Trash } from "lucide-react"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { motion } from "motion/react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { recentWorkoutsQueryKey } from "./RecentWorkoutsCard"
import { historyQueryKey } from "./dashboard-screen/HistoryScreen"
import MuscleGroupBadge from "./MuscleGroupBadge"

type Props = {
  workout: WorkoutHistoryExercise
}

export default function WorkoutHistoryCard({ workout }: Props) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { currentPage } = useWorkoutManager()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteWorkoutMutation = useMutation(
    trpc.workouts.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [historyQueryKey] })
        queryClient.invalidateQueries({ queryKey: [recentWorkoutsQueryKey] })
      },
    }),
  )

  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(workout), [workout])

  const formattedDate = React.useMemo(
    () => formatWorkoutDate(workout.startTime, "MMM d, yyyy"),
    [workout.startTime],
  )

  const muscleGroupsToShow = allMuscleGroups.slice(0, 3)
  const hasMore = allMuscleGroups.length > 3
  const moreCount = allMuscleGroups.length - 3

  const handleDeleteWorkout = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    deleteWorkoutMutation.mutate(
      { id: workout.id },
      { onSuccess: () => setShowDeleteDialog(false) },
    )
  }

  return (
    <motion.div layoutId={`${currentPage}-${workout.id}`}>
      <WorkoutHistorySummary workout={workout}>
        <div className="hover:border-primary bg-card relative flex flex-col space-y-2 rounded-xl border p-4 text-left transition-all">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">{workout.name}</p>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">{formattedDate}</span>
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
                    Icon={Menu}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem variant="destructive" onClick={handleDeleteWorkout}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Workout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {workout.workoutExercises.length > 0 ? (
              <p className="text-muted-foreground text-sm">
                {workout.workoutExercises.length} exercise
                {workout.workoutExercises.length !== 1 ? "s" : ""}
              </p>
            ) : null}
          </div>

          {allMuscleGroups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {muscleGroupsToShow.map((group) => (
                <MuscleGroupBadge key={group} muscleGroup={group} />
              ))}

              {hasMore && <MuscleGroupBadge muscleGroup={`+${moreCount} more`} />}
            </div>
          )}
        </div>

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
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteDialog(false)}
              >
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
      </WorkoutHistorySummary>
    </motion.div>
  )
}
