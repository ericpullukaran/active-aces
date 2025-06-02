"use client"

import React from "react"
import { cn } from "~/lib/utils"
import { useTimer } from "~/components/dashboard-screen/TimerProvider"
import { Input } from "~/components/ui/input"
import { type MeasurementMetric } from "~/lib/db/types"
import { AnimatePresence, motion } from "motion/react"
import { Checkbox } from "./ui/checkbox"
import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction,
} from "react-swipeable-list"
import "react-swipeable-list/dist/styles.css"
import { Trash2 } from "lucide-react"
import { WorkoutExerciseWidgetTimeInput } from "./WorkoutExerciseWidgetTimeInput"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"

export const measurementToDetails: Record<
  MeasurementMetric,
  { inputProps: React.InputHTMLAttributes<HTMLInputElement>; label: string }
> = {
  weight: {
    inputProps: { placeholder: "Weight" },
    label: "Weight",
  },
  reps: {
    inputProps: { placeholder: "Reps", min: 0 },
    label: "Reps",
  },
  assistedReps: {
    inputProps: { placeholder: "Assisted", min: 0 },
    label: "Assisted",
  },
  time: {
    inputProps: { placeholder: "Time", min: 0 },
    label: "Time",
  },
  distance: {
    inputProps: { placeholder: "Distance", min: 0 },
    label: "Distance",
  },
}

type Props = {
  stableExerciseId: string
  measurements: MeasurementMetric[]
}

export default function WorkoutExerciseWidgetInputs({ stableExerciseId, measurements }: Props) {
  const { setTimerDurationSeconds } = useTimer()
  const snap = useSnapshot(workoutStore)
  const exercise = snap.currentWorkout?.exercises.find(
    (ex) => ex.stableExerciseId === stableExerciseId,
  )

  if (!exercise) return null

  const getTrailingActions = (stableSetId: string) =>
    exercise.sets.length > 1 ? (
      <TrailingActions>
        <SwipeAction
          destructive
          onClick={() => {
            workoutActions.removeSet(stableExerciseId, stableSetId)
          }}
        >
          <div className="bg-destructive flex h-full items-center justify-center px-4">
            <Trash2 className="h-5 w-5 text-white" />
          </div>
        </SwipeAction>
      </TrailingActions>
    ) : null

  return (
    <div className="space-y-2">
      <SwipeableList className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {exercise.sets.map((set, setIndex) => (
            <SwipeableListItem
              key={set.stableSetId}
              threshold={0.5}
              trailingActions={getTrailingActions(set.stableSetId)}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                layoutId={set.stableSetId}
                className={cn(
                  "grid w-full items-center gap-2 tabular-nums transition-colors",
                  {
                    "bg-green-950": set.completed,
                  },
                  {
                    "rounded-t-2xl": setIndex === 0 || !exercise.sets[setIndex - 1]?.completed,
                    "rounded-b-2xl":
                      exercise.sets.length - 1 === setIndex ||
                      !exercise.sets[setIndex + 1]?.completed,
                    "bg-green-950": set.completed,
                  },
                )}
                style={{
                  gridTemplateColumns: `3rem ${measurements.map(() => "1fr").join(" ")} 3rem`,
                }}
              >
                <div className={cn("grid place-content-center text-center font-semibold")}>
                  {setIndex + 1}
                </div>
                {measurements.map((measurement) => {
                  if (measurement === "time") {
                    return (
                      <WorkoutExerciseWidgetTimeInput
                        key={measurement}
                        set={set}
                        stableExerciseId={stableExerciseId}
                      />
                    )
                  }

                  return (
                    <Input
                      key={measurement}
                      disabled={set.completed}
                      type="number"
                      inputMode="decimal"
                      className={cn(
                        "no-spin-buttons w-full rounded-md border-none bg-transparent p-2 text-center focus:ring-transparent",
                      )}
                      onFocus={(event) => event.target.select()}
                      {...measurementToDetails[measurement].inputProps}
                      value={set[measurement]}
                      onChange={(e) =>
                        workoutActions.updateSet(stableExerciseId, set.stableSetId, {
                          [measurement]: e.target.valueAsNumber,
                        })
                      }
                    />
                  )
                })}
                <Checkbox
                  className="accent-primary h-8 w-12 rounded-full border-zinc-300 bg-transparent focus:ring-green-800"
                  checked={set.completed}
                  onCheckedChange={(checked) => {
                    workoutActions.updateSet(stableExerciseId, set.stableSetId, {
                      completed: !!checked,
                      completedAt: !!checked ? new Date() : undefined,
                    })
                    if (checked) {
                      if (exercise.restTimeMs && exercise.restTimeMs > 0) {
                        setTimerDurationSeconds({
                          setId: set.stableSetId,
                          duration: exercise.restTimeMs / 1000,
                        })
                      }
                    }
                  }}
                />
              </motion.div>
            </SwipeableListItem>
          ))}
        </AnimatePresence>
      </SwipeableList>
    </div>
  )
}
