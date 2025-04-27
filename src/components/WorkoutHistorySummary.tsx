"use client"

import React from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MeasurementType } from "~/lib/db/types"
import { MEASUREMENT_FIELDS, getFieldKeys, formatSetValue } from "~/lib/utils/measurement"
import { WorkoutHistoryExercise } from "~/lib/types/workout"
import {
  extractMuscleGroups,
  formatWorkoutDate,
  calculateWorkoutDuration,
} from "~/lib/utils/workout-helpers"

type WorkoutSummaryProps = {
  workout: WorkoutHistoryExercise
  children: React.ReactNode
}

export default function WorkoutHistorySummary({ workout, children }: WorkoutSummaryProps) {
  const formattedDate = React.useMemo(
    () => formatWorkoutDate(workout.startTime, "MMMM d, yyyy 'at' h:mm a"),
    [workout.startTime],
  )

  const duration = React.useMemo(
    () => calculateWorkoutDuration(workout.startTime, workout.endTime),
    [workout.startTime, workout.endTime],
  )

  const allMuscleGroups = React.useMemo(() => extractMuscleGroups(workout), [workout])

  return (
    <ResponsiveDialog
      title={workout.name}
      description={`${formattedDate}${duration ? ` • ${duration}` : ""}`}
      renderTrigger={({ openDialog }) => (
        <div onClick={openDialog} className="cursor-pointer">
          {children}
        </div>
      )}
      renderContent={({ closeDialog }) => (
        <div className="flex flex-col gap-4 p-4">
          {/* Muscle groups */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Muscle Groups</h3>
            {allMuscleGroups.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allMuscleGroups.map((group) => (
                  <Badge key={group} variant="outline" className="bg-primary/10">
                    {group}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes if available */}
          {workout.notes && (
            <div className="mt-2">
              <h3 className="mb-1 text-sm font-medium">Notes</h3>
              <p className="text-muted-foreground text-sm">{workout.notes}</p>
            </div>
          )}

          {/* Exercises */}
          <div className="mt-2 space-y-4">
            <h3 className="text-lg font-medium">Exercises</h3>
            {workout.workoutExercises.map((exerciseData, idx) => {
              const { exercise, sets = [], notes } = exerciseData
              const hasAssistedReps = sets.some((set) => set.assistedReps)
              console.log(sets)
              const measurementType = exercise.measurementType || MeasurementType.WEIGHT_REPS
              const fieldKeys = getFieldKeys(measurementType, hasAssistedReps)

              return (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{exercise.name}</h4>
                    {exercise.primaryMuscleGroup && (
                      <Badge variant="outline" className="bg-primary/5">
                        {exercise.primaryMuscleGroup.name}
                      </Badge>
                    )}
                  </div>

                  {sets.length > 0 ? (
                    <div className="mt-2">
                      {/* Header row with field names */}
                      <div
                        className="text-muted-foreground mb-1 grid gap-2 text-sm"
                        style={{
                          gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")}`,
                        }}
                      >
                        <div>Set</div>
                        {fieldKeys.map((field) => (
                          <div key={field}>{MEASUREMENT_FIELDS[field].label}</div>
                        ))}
                      </div>

                      {/* Set rows */}
                      {sets.map((set, setIdx) => (
                        <div
                          key={setIdx}
                          className={`grid gap-2 py-1 text-sm ${!set.completed ? "text-muted-foreground" : ""}`}
                          style={{
                            gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")}`,
                          }}
                        >
                          <div>{setIdx + 1}</div>
                          {fieldKeys.map((field) => (
                            <div key={field}>{formatSetValue(set, field)}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">No sets recorded</p>
                  )}

                  {/* Exercise notes if available */}
                  {notes && (
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">{notes}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
      renderFooter={({ closeDialog }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeDialog} className="flex-1">
            Close
          </Button>
        </div>
      )}
    />
  )
}
