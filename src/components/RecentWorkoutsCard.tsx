"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "./ui/button"
import WorkoutHistoryCard from "./WorkoutHistoryCard"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"

export default function RecentWorkoutsCard() {
  const trpc = useTRPC()
  const workoutHistory = useQuery(trpc.workouts.history.queryOptions())

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
    return <div className="bg-card h-96 animate-pulse rounded-lg"></div>
  }

  return (
    <div className="bg-card rounded-lg p-4">
      <div className="mb-3 flex items-center">
        <h3 className="flex-1 text-lg font-semibold">Recent Workouts</h3>
        <Button variant={"ghost"} className="bg-card" asChild>
          <Link href={"/dashboard/history"} className="flex text-right">
            See More
            <ArrowRight className="ml-1" />
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {workoutHistory.data?.map((w) => (
          <WorkoutHistoryCard key={w.id} workout={w} internalNav={true} />
        ))}
      </div>
    </div>
  )
}
