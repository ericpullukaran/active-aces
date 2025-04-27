"use client"

import React from "react"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import { Doc } from "~/lib/db"

type Props = {
  workout: Doc<"workouts"> & {
    workoutExercises: Array<{
      exercise: {
        name: string
        primaryMuscleGroup?: {
          name: string
        } | null
      }
    }>
  }
  internalNav?: boolean
}

export default function WorkoutHistoryCard({ workout, internalNav }: Props) {
  // Extract all unique muscle groups from the workout
  const allMuscleGroups = React.useMemo(() => {
    const muscleGroupsSet = new Set<string>()

    workout.workoutExercises.forEach((we) => {
      // Add primary muscle group if exists
      if (we.exercise.primaryMuscleGroup?.name) {
        muscleGroupsSet.add(we.exercise.primaryMuscleGroup.name)
      }
    })

    return Array.from(muscleGroupsSet)
  }, [workout])

  // Get the date for display
  const formattedDate = React.useMemo(() => {
    if (!workout.startTime) return ""
    return format(new Date(workout.startTime), "MMM d, yyyy")
  }, [workout.startTime])

  // Determine which muscle groups to show
  const muscleGroupsToShow = allMuscleGroups.slice(0, 3)
  const hasMore = allMuscleGroups.length > 3
  const moreCount = allMuscleGroups.length - 3

  return (
    <div className="hover:border-primary bg-card flex flex-col space-y-2 rounded-xl border p-4 text-left transition-all">
      <div className="flex items-center justify-between">
        <p className="text-lg font-medium">{workout.name}</p>
        <span className="text-muted-foreground text-sm">{formattedDate}</span>
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
            <Badge key={group} variant="outline" className="bg-primary/10">
              {group}
            </Badge>
          ))}

          {hasMore && (
            <Badge variant="outline" className="bg-primary/5">
              +{moreCount} more
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
