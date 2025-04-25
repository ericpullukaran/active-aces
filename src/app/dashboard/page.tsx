"use client"
import React from "react"
import { HomeScreen } from "~/components/dashboard-screen/HomeScreen"
import { useWorkoutManager } from "~/components/workout-manager/WorkoutManagerProvider"
import { UnreachableError } from "~/lib/utils/errors"

export default function DashboardPage() {
  const { currentPage } = useWorkoutManager()

  switch (currentPage) {
    case "home":
      return <HomeScreen />
    case "history":
      return <div>History</div>
    case "workout":
      return <div>Workout</div>
    case "exercises":
      return <div>Exercises</div>
    default:
      throw new UnreachableError(currentPage)
  }
}
