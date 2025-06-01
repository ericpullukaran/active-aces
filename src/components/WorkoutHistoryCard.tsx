"use client"

import React from "react"
import WorkoutHistorySummary from "./WorkoutHistorySummary"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import { extractMuscleGroups, formatWorkoutDate } from "~/lib/utils/workout-helpers"
import { motion } from "motion/react"
import MuscleGroupBadge from "./MuscleGroupBadge"
import { navigationStore } from "~/lib/stores/navigationStore"
import { useSnapshot } from "valtio"

type Props = {
  workout: WorkoutHistoryExercise
}

export default function WorkoutHistoryCard({ workout }: Props) {
  const observableNavigation = useSnapshot(navigationStore)
  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(workout), [workout])
  const formattedDate = React.useMemo(
    () => formatWorkoutDate(workout.startTime, "MMM d, yyyy"),
    [workout.startTime],
  )
  const muscleGroupsToShow = allMuscleGroups.slice(0, 3)
  const hasMore = allMuscleGroups.length > 3
  const moreCount = allMuscleGroups.length - 3

  return (
    <motion.div layoutId={`${observableNavigation.currentPage}-${workout.id}`}>
      <WorkoutHistorySummary workout={workout}>
        <div className="hover:border-primary bg-card relative flex flex-col space-y-2 rounded-xl border p-4 text-left transition-all">
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium">{workout.name}</p>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground text-sm">{formattedDate}</span>
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
      </WorkoutHistorySummary>
    </motion.div>
  )
}
