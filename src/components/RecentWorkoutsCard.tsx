"use client"

import React from "react"

import { Button } from "./ui/button"
import WorkoutHistoryCard from "./WorkoutHistoryCard"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

export const recentWorkoutsQueryKey: readonly string[] = ["recent-workouts"]
export default function RecentWorkoutsCard() {
  const trpc = useTRPC()
  const workoutHistory = useQuery({
    ...trpc.workouts.historyInfinite.queryOptions({ limit: 2 }),
    queryKey: [recentWorkoutsQueryKey],
  })
  const { setCurrentPage, currentPage } = useWorkoutManager()

  if (workoutHistory.isError) {
    return (
      <div className="bg-card h-96 animate-pulse rounded-lg">
        <div className="flex h-full flex-col justify-center">
          <p className="text-muted-foreground">Error loading workouts</p>
        </div>
      </div>
    )
  }

  if (workoutHistory.isLoading) {
    return <div className="bg-card h-80 animate-pulse rounded-lg"></div>
  }

  return (
    <div>
      <div className="mb-3 flex items-center">
        <h3 className="flex-1 text-lg font-semibold">Recent Workouts</h3>
        <Button
          variant={"outline"}
          onClick={() => setCurrentPage("history")}
          className="bg-card flex text-right"
        >
          See More
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {workoutHistory.data?.items.length === 0 && (
          <div className="bg-card h-28 rounded-lg">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground text-center">No recent workouts!</p>
            </div>
          </div>
        )}
        {workoutHistory.data?.items.map((w) => (
          <WorkoutHistoryCard key={`${currentPage}-${w.id}`} workout={w} />
        ))}
      </div>
    </div>
  )
}
