"use client"

import React from "react"

import { Button } from "./ui/button"
import WorkoutHistoryCard from "./WorkoutHistoryCard"
import { navigationActions, navigationStore } from "~/lib/stores/navigationStore"
import { useSnapshot } from "valtio"
import { useInfiniteHistory } from "~/lib/utils/useInfiniteHistory"

export default function RecentWorkoutsCard() {
  const workoutHistoryQuery = useInfiniteHistory({ limit: 2 })
  const observableNavigation = useSnapshot(navigationStore)

  if (workoutHistoryQuery.isError) {
    return (
      <div className="bg-card h-96 animate-pulse rounded-lg">
        <div className="flex h-full flex-col justify-center">
          <p className="text-muted-foreground">Error loading workouts</p>
        </div>
      </div>
    )
  }

  if (workoutHistoryQuery.isLoading) {
    return <div className="bg-card h-80 animate-pulse rounded-lg"></div>
  }

  return (
    <div>
      <div className="mb-3 flex items-center">
        <h3 className="flex-1 text-lg font-semibold">Recent Workouts</h3>
        <Button
          variant={"outline"}
          onClick={() => navigationActions.setCurrentPage("history")}
          className="bg-card flex text-right"
        >
          See More
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {workoutHistoryQuery.workouts.length === 0 && (
          <div className="bg-card h-28 rounded-lg">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground text-center">No recent workouts!</p>
            </div>
          </div>
        )}
        {workoutHistoryQuery.workouts.map((w) => (
          <WorkoutHistoryCard key={`${observableNavigation.currentPage}-${w.id}`} workout={w} />
        ))}
      </div>
    </div>
  )
}
