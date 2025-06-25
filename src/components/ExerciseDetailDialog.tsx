"use client"

import React, { useState, useMemo } from "react"
import { type DbExercise } from "~/lib/types/workout"
import { Button } from "./ui/button"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, Dumbbell, Clock, Trash, Menu } from "lucide-react"
import { getChartConfigForSets } from "~/lib/utils/chartConfigs"
import SlideTransition from "./ui/SlideTransition"
import MuscleGroupBadge from "./MuscleGroupBadge"
import { MeasurementTypeLabels } from "~/lib/utils/measurement"
import AnimatedTabs from "./ui/AnimatedTabs"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { cn } from "~/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "motion/react"
import {
  useTabAnimation,
  directionalVariants,
  tabTransition,
  type TabItem,
} from "~/lib/utils/useTabAnimations"

type TabId = "details" | "history"

type ExerciseDetailDialogProps = {
  exercise: DbExercise
  isOpen: boolean
  onClose: () => void
  initialTab?: TabId
}

const tabs = [
  { id: "details", title: "Details" },
  { id: "history", title: "History" },
] satisfies (TabItem & { id: TabId })[]

export default function ExerciseDetailDialog({
  exercise,
  isOpen,
  onClose,
  initialTab = "details",
}: ExerciseDetailDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { activeTab, setActiveTab, direction } = useTabAnimation(tabs, initialTab)

  const exerciseHistoryQuery = useQuery(
    trpc.workouts.history.exercise.queryOptions({
      exerciseId: exercise.id,
      limit: 10,
    }),
  )

  const deleteExerciseMutation = useMutation(
    trpc.exercises.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: trpc.exercises.all.queryKey() })
        queryClient.setQueryData(trpc.exercises.all.queryKey(), (data) => {
          if (!data) return new Map([[exercise.id, { ...exercise, deleted: true }]])
          return new Map(data).set(exercise.id, { ...exercise, deleted: true })
        })
      },
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

    const exerciseData = workout.workoutExercise.exercise
    const sets = workout.workoutExercise.sets

    const chartResult = getChartConfigForSets(exerciseData.measurementType, sets)

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

  const confirmDelete = () => {
    deleteExerciseMutation.mutate(
      { exerciseId: exercise.id },
      {
        onSuccess: () => {
          setShowDeleteDialog(false)
          onClose()
        },
      },
    )
  }

  const renderDetailsTab = () => (
    <div className="flex flex-col space-y-6 p-4">
      {/* Description */}
      <div className="space-y-1.5">
        <h3 className="text-foreground text-sm font-medium">Description</h3>
        <p className="text-muted-foreground text-sm">{exercise.description ?? "No description"}</p>
      </div>

      {/* Muscle groups section */}
      <div className="space-y-2">
        <h3 className="text-foreground text-sm font-medium">Muscle Groups</h3>
        <div className="flex flex-col gap-2">
          {!exercise.primaryMuscleGroup &&
            (!exercise.exerciseMuscleGroups || exercise.exerciseMuscleGroups.length < 0) && (
              <p className="text-muted-foreground text-sm">No muscle groups specified</p>
            )}
          {exercise.primaryMuscleGroup && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-16 text-xs">Primary:</span>
              <MuscleGroupBadge muscleGroup={exercise.primaryMuscleGroup.name} />
            </div>
          )}

          {exercise.exerciseMuscleGroups?.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground mt-1 w-16 text-xs">Secondary:</span>
              <div className="flex flex-wrap gap-2">
                {exercise.exerciseMuscleGroups.map((group) => (
                  <MuscleGroupBadge
                    key={group.muscleGroup.id}
                    muscleGroup={group.muscleGroup.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exercise details */}
      <div className="grid grid-cols-2 gap-4">
        {/* Measurement type */}
        <div className="space-y-1.5">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            <Dumbbell className="h-4 w-4" />
            <h3>Measurement</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            {MeasurementTypeLabels[exercise.measurementType]}
          </p>
        </div>

        {/* Rest time if available */}
        <div className="space-y-1.5">
          <div className="text-foreground flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <h3>Default Rest</h3>
          </div>
          <p className="text-muted-foreground text-sm">
            {exercise.defaultRestTime
              ? `${Math.floor(exercise.defaultRestTime / 1000)} seconds`
              : "Not specified"}
          </p>
        </div>
      </div>

      {/* Creator information if available */}
      {exercise.creatorId && (
        <div className="space-y-1.5 border-t pt-2">
          <h3 className="text-muted-foreground text-xs">Custom Exercise</h3>
          <p className="flex items-center text-sm">
            <span className="bg-primary/20 text-primary rounded-full px-2 py-0.5 text-xs">
              Created by you
            </span>
          </p>
        </div>
      )}
    </div>
  )

  const renderHistoryTab = () => {
    if (exerciseHistoryQuery.isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">Loading exercise history...</p>
        </div>
      )
    }

    if (!exerciseHistoryQuery.data || exerciseHistoryQuery.data.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-sm">No exercise history found</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Complete a workout with this exercise to see history
          </p>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        {/* Chart Section */}
        <div>
          <h4 className="font-medium">Performance by Set</h4>
          {renderChart()}
        </div>

        {/* Notes */}
        {currentWorkout?.workoutExercise.notes && (
          <div>
            <h4 className="font-medium">Notes</h4>
            <p className="text-muted-foreground">{currentWorkout.workoutExercise.notes}</p>
          </div>
        )}
      </div>
    )
  }

  const renderCurrentTabContent = () => {
    switch (activeTab) {
      case "details":
        return renderDetailsTab()
      case "history":
        return renderHistoryTab()
      default:
        return null
    }
  }

  const renderNavigationFooter = () => {
    if (
      activeTab !== "history" ||
      !exerciseHistoryQuery.data ||
      exerciseHistoryQuery.data.length <= 1
    ) {
      return null
    }

    return (
      <div className="relative isolate flex items-center justify-between">
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
    )
  }

  return (
    <>
      <ResponsiveDialog
        title={exercise.name}
        open={isOpen}
        onClose={onClose}
        forceDrawerFullHeight
        headerAction={
          exercise.creatorId
            ? () => (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button scalingOnClick variant="outline" size="icon-sm" Icon={Menu} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Exercise
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            : undefined
        }
        renderContent={() => (
          <div className="flex flex-col">
            {/* Animated Tabs Header */}
            <div className="flex h-full overflow-hidden px-4">
              <AnimatedTabs
                value={activeTab}
                activeClassName="bg-primary/10 rounded-md"
                interactionHandler={{
                  type: "click",
                  onChange: setActiveTab,
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    data-id={tab.id}
                    className={cn(
                      "relative flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab.title}
                  </button>
                ))}
              </AnimatedTabs>
            </div>

            {/* Animated Tab Content */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <motion.div
                  key={activeTab}
                  custom={direction}
                  transition={tabTransition}
                  variants={directionalVariants}
                  initial="enter"
                  animate="target"
                  exit="exit"
                  className="h-full overflow-auto"
                >
                  {renderCurrentTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
        renderFooter={renderNavigationFooter}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onClose={() => setShowDeleteDialog(false)}
        >
          <DialogHeader>
            <DialogTitle>Delete Exercise</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this custom exercise? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              isLoading={deleteExerciseMutation.isPending}
              className="flex-1"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
