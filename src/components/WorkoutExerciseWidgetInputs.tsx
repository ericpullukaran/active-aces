"use client"

import React from "react"
import { cn } from "~/lib/utils"
import { useWorkoutManager } from "~/components/dashboard-screen/WorkoutManagerProvider"
import { Input } from "~/components/ui/input"
import { MeasurementMetric } from "~/lib/db/types"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
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
  measurements: MeasurementMetric[]
  exercise: WorkoutExerciseWithMetadata
}

export default function WorkoutExerciseWidgetInputs({ measurements, exercise }: Props) {
  const { updateSet, removeSet } = useWorkoutManager()

  const getTrailingActions = (setId: string) =>
    exercise.sets.length > 1 ? (
      <TrailingActions>
        <SwipeAction
          destructive
          onClick={() => {
            removeSet(exercise.stableExerciseId, setId)
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
      <SwipeableList>
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
                    "rounded-t-lg": setIndex === 0 || !exercise.sets[setIndex - 1]?.completed,
                    "rounded-b-lg":
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
                {measurements.map((measurement) => (
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
                      updateSet(exercise.stableExerciseId, set.stableSetId, {
                        [measurement]: e.target.valueAsNumber,
                      })
                    }
                  />
                ))}
                <Checkbox
                  className="accent-primary h-6 w-10 rounded-full border-zinc-300 bg-transparent focus:ring-green-800"
                  checked={set.completed}
                  onCheckedChange={(checked) =>
                    updateSet(exercise.stableExerciseId, set.stableSetId, {
                      completed: !!checked,
                      completedAt: !!checked ? new Date() : undefined,
                    })
                  }
                />
              </motion.div>
            </SwipeableListItem>
          ))}
        </AnimatePresence>
      </SwipeableList>
    </div>
  )
}
