"use client"
import React from "react"
import { HomeScreen } from "~/components/dashboard-screen/HomeScreen"
import WorkoutScreen from "~/components/dashboard-screen/WorkoutScreen"
import { useWorkoutManager } from "~/components/dashboard-screen/WorkoutManagerProvider"
import { UnreachableError } from "~/lib/utils/errors"
import ExercisesScreen from "~/components/dashboard-screen/ExercisesScreen"
import HistoryScreen from "~/components/dashboard-screen/HistoryScreen"

export default function DashboardPage() {
  const { currentPage } = useWorkoutManager()

  switch (currentPage) {
    case "home":
      return <HomeScreen />
    case "history":
      return <HistoryScreen />
    case "workout":
      return <WorkoutScreen />
    case "exercises":
      return <ExercisesScreen />
    default:
      throw new UnreachableError(currentPage)
  }
}
