"use client"

import React from "react"
import { cn } from "~/lib/utils"
import { useTimer } from "~/components/dashboard-screen/TimerProvider"
import { Input } from "~/components/ui/input"
import { type MeasurementMetric } from "~/lib/db/types"
import { AnimatePresence, motion } from "motion/react"
import { Checkbox } from "./ui/checkbox"
import { SwipeableListItem, TrailingActions, SwipeAction } from "react-swipeable-list"
import "react-swipeable-list/dist/styles.css"
import { Trash2 } from "lucide-react"
import { WorkoutExerciseWidgetTimeInput } from "./WorkoutExerciseWidgetTimeInput"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { useSnapshot } from "valtio"
import ExerciseNotesDialog from "./ExerciseNotesDialog"
import { Button } from "./ui/button"

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
  const [isNotesDialogOpen, setIsNotesDialogOpen] = React.useState(false)
  const [clickedSetNumber, setClickedSetNumber] = React.useState<number | null>(null)

  const exercise = snap.currentWorkout?.exercises.find(
    (ex) => ex.stableExerciseId === stableExerciseId,
  )

  if (!exercise) return null

  const handleSetNumberClick = (setNumber: number) => {
    setClickedSetNumber(setNumber)
    setIsNotesDialogOpen(true)
  }

  const handleNotesDialogClose = () => {
    setIsNotesDialogOpen(false)
    setClickedSetNumber(null)
  }

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
    <>
      <motion.div layout className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {exercise.sets.map((set, setIndex) => (
            <motion.div
              layout
              key={set.stableSetId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SwipeableListItem
                key={set.stableSetId}
                threshold={0.5}
                trailingActions={getTrailingActions(set.stableSetId)}
              >
                <div
                  className={cn(
                    "grid w-full items-center gap-2 rounded-tr-2xl rounded-br-2xl tabular-nums transition-colors",
                    {
                      "bg-green-950": set.completed,
                    },
                    {
                      "rounded-tl-2xl": setIndex === 0 || !exercise.sets[setIndex - 1]?.completed,
                      "rounded-bl-2xl":
                        exercise.sets.length - 1 === setIndex ||
                        !exercise.sets[setIndex + 1]?.completed,
                      "bg-green-950": set.completed,
                    },
                  )}
                  style={{
                    gridTemplateColumns: `3rem ${measurements.map(() => "1fr").join(" ")} 3rem`,
                  }}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "hover:bg-opacity-20 grid cursor-pointer place-content-center rounded-md text-center font-semibold transition-colors hover:bg-gray-200",
                    )}
                    onClick={() => handleSetNumberClick(setIndex + 1)}
                  >
                    {setIndex + 1}
                  </Button>
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
                </div>
              </SwipeableListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ExerciseNotesDialog
        exerciseId={stableExerciseId}
        initialNotes={exercise.notes || ""}
        isOpen={isNotesDialogOpen}
        onClose={handleNotesDialogClose}
        setNumber={clickedSetNumber}
      />
    </>
  )
}
