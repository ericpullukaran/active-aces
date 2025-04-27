"use client"

import React from "react"
import { Badge } from "./ui/badge"
import WorkoutHistorySummary from "./WorkoutHistorySummary"
import { WorkoutHistoryExercise } from "~/lib/types/workout"
import { extractMuscleGroups, formatWorkoutDate } from "~/lib/utils/workout-helpers"

type Props = {
  workout: WorkoutHistoryExercise
}

export default function WorkoutHistoryCard({ workout }: Props) {
  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(workout), [workout])

  const formattedDate = React.useMemo(
    () => formatWorkoutDate(workout.startTime, "MMM d, yyyy"),
    [workout.startTime],
  )

  const muscleGroupsToShow = allMuscleGroups.slice(0, 3)
  const hasMore = allMuscleGroups.length > 3
  const moreCount = allMuscleGroups.length - 3

  return (
    <WorkoutHistorySummary workout={workout}>
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
    </WorkoutHistorySummary>
  )
}
