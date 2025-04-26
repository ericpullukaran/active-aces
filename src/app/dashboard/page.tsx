"use client"
import React from "react"
import { HomeScreen } from "~/components/dashboard-screen/HomeScreen"
import WorkoutScreen from "~/components/dashboard-screen/WorkoutScreen"
import { useWorkoutManager } from "~/components/dashboard-screen/WorkoutManagerProvider"
import { UnreachableError } from "~/lib/utils/errors"

export default function DashboardPage() {
  const { currentPage } = useWorkoutManager()

  switch (currentPage) {
    case "home":
      return <HomeScreen />
    case "history":
      return <div>History</div>
    case "workout":
      return <WorkoutScreen />
    case "exercises":
      return <div>Exercises</div>
    default:
      throw new UnreachableError(currentPage)
  }
}
