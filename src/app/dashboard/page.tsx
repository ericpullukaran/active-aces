"use client"
import React from "react"
import { HomeScreen } from "~/components/dashboard-screen/HomeScreen"
import WorkoutScreen from "~/components/dashboard-screen/WorkoutScreen"
import { UnreachableError } from "~/lib/utils/errors"
import ExercisesScreen from "~/components/dashboard-screen/ExercisesScreen"
import HistoryScreen from "~/components/dashboard-screen/HistoryScreen"
import { navigationStore } from "~/lib/stores/navigationStore"
import { useSnapshot } from "valtio"

export default function DashboardPage() {
  const currentPage = useSnapshot(navigationStore).currentPage

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
      return <HomeScreen />
  }
}
