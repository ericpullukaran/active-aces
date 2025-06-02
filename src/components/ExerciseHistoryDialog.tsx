"use client"

import React, { useMemo, useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getChartConfigForSets } from "~/lib/utils/chartConfigs"
import SlideTransition from "./ui/SlideTransition"

type ExerciseHistoryDialogProps = {
  exerciseId: string
  isOpen: boolean
  onClose: () => void
}

export default function ExerciseHistoryDialog({
  exerciseId,
  isOpen,
  onClose,
}: ExerciseHistoryDialogProps) {
  const trpc = useTRPC()
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0)

  const exerciseHistoryQuery = useQuery(
    trpc.workouts.getExerciseHistory.queryOptions({
      exerciseId,
      limit: 10,
    }),
  )

  const { currentWorkout, chartResult } = useMemo(() => {
    if (!exerciseHistoryQuery.data || exerciseHistoryQuery.data.length === 0) {
      return { currentWorkout: null, chartResult: null }
    }

    const workouts = exerciseHistoryQuery.data
    const workout = workouts[currentWorkoutIndex]

    if (!workout) {
      return { currentWorkout: null, chartResult: null }
    }

    const exercise = workout.workoutExercise.exercise
    const sets = workout.workoutExercise.sets

    // Get the chart configuration for this measurement type
    const chartResult = getChartConfigForSets(exercise.measurementType, sets)

    return { currentWorkout: workout, chartResult }
  }, [exerciseHistoryQuery.data, currentWorkoutIndex])

  const navigateWorkout = (direction: "prev" | "next") => {
    if (!exerciseHistoryQuery.data) return

    if (direction === "prev" && currentWorkoutIndex < exerciseHistoryQuery.data.length - 1) {
      setCurrentWorkoutIndex(currentWorkoutIndex + 1)
    } else if (direction === "next" && currentWorkoutIndex > 0) {
      setCurrentWorkoutIndex(currentWorkoutIndex - 1)
    }
  }

  const renderChart = () => {
    if (!chartResult || chartResult.chartData.length === 0) {
      return <p className="text-muted-foreground py-8 text-center">No sets to display</p>
    }

    return chartResult.renderChart()
  }

  const isFirstWorkout = currentWorkoutIndex === 0
  const isLastWorkout = currentWorkoutIndex === (exerciseHistoryQuery.data?.length ?? 0) - 1

  return (
    <ResponsiveDialog
      title="Exercise History"
      open={isOpen}
      onClose={onClose}
      renderContent={() => (
        <div className="flex flex-col gap-6">
          <div>
            {/* Notes */}
            {currentWorkout?.workoutExercise.notes && (
              <div className="px-4">
                <h4 className="font-medium">Notes</h4>
                <p className="text-muted-foreground">{currentWorkout.workoutExercise.notes}</p>
              </div>
            )}

            {/* Chart Section */}
            <div>
              <h4 className="p-4 font-medium">Performance by Set</h4>
              {renderChart()}
            </div>
          </div>

          {/* Navigation Header */}
          <div className="relative isolate flex items-center justify-between px-4 pb-10">
            <Button
              variant={isLastWorkout ? "ghost" : "secondary"}
              size="icon"
              onClick={() => navigateWorkout("prev")}
              disabled={isLastWorkout}
              title="Go to older workout"
              className="z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <SlideTransition
              currentIndex={currentWorkoutIndex}
              className="z-0 w-full"
              onSwipeLeft={() => navigateWorkout("next")}
              onSwipeRight={() => navigateWorkout("prev")}
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="font-medium">{currentWorkout?.name}</h3>
                  {currentWorkoutIndex === 0 && (
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                      Latest
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">
                  {currentWorkout && new Date(currentWorkout.startTime).toLocaleDateString()}
                  {" • "}
                  Session {currentWorkoutIndex + 1} of {exerciseHistoryQuery.data?.length}
                  {exerciseHistoryQuery.data && exerciseHistoryQuery.data.length > 1 && (
                    <span className="mt-1 block text-xs">← Older • Newer →</span>
                  )}
                </p>
              </div>
            </SlideTransition>

            <Button
              variant={isFirstWorkout ? "ghost" : "secondary"}
              size="icon"
              onClick={() => navigateWorkout("next")}
              disabled={isFirstWorkout}
              title="Go to newer workout"
              className="z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    />
  )
}
