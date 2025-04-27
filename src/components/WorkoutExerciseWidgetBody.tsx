"use client"

import { PlusIcon, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { MeasurementMetric, MeasurementType } from "~/lib/db/types"
import { defaultExerciseSet } from "~/lib/utils/defaults"
import WorkoutExerciseWidgetInputs from "./WorkoutExerciseWidgetInputs"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

const measurementFields = {
  weight: { label: "Weight" },
  reps: { label: "Reps" },
  assistedReps: { label: "Assisted" },
  time: { label: "Time" },
  distance: { label: "Distance" },
} satisfies Record<MeasurementMetric, { label: string }>

const exerciseTypeToFields: Record<MeasurementType, MeasurementMetric[]> = {
  [MeasurementType.WEIGHT_REPS]: ["weight", "reps", "assistedReps"],
  [MeasurementType.TIME_DISTANCE]: ["time", "distance"],
  [MeasurementType.WEIGHT_DURATION]: ["weight", "time"],
  [MeasurementType.WEIGHT_DISTANCE]: ["weight", "distance"],
  [MeasurementType.TIME]: ["time"],
  [MeasurementType.REPS]: ["reps"],
}

export default function WorkoutExerciseWidgetBody({
  exercise,
}: {
  exercise: WorkoutExerciseWithMetadata
}) {
  const { addSet } = useWorkoutManager()
  const measurementType = exercise.metadata.measurementType
  const getFieldKeys = (measurementType: MeasurementType): MeasurementMetric[] => {
    switch (measurementType) {
      case MeasurementType.WEIGHT_REPS:
        return ["weight", "reps", ...(exercise.enableAssistedReps ? ["assistedReps" as const] : [])]
      case MeasurementType.TIME_DISTANCE:
        return ["time", "distance"]
      case MeasurementType.WEIGHT_DURATION:
        return ["weight", "time"]
      case MeasurementType.WEIGHT_DISTANCE:
        return ["weight", "distance"]
      case MeasurementType.TIME:
        return ["time"]
      case MeasurementType.REPS:
        return ["reps"]
      default:
        return []
    }
  }
  const fieldKeys = getFieldKeys(measurementType)

  return (
    <div className="p-4 pt-2">
      {/* Header row with labels */}
      <div
        className="grid items-center gap-1 py-2 text-center"
        style={{
          gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")} 3rem`,
        }}
      >
        {[
          "Set",
          ...fieldKeys.map((field) => measurementFields[field].label),
          <Check key="check" className="mx-auto" size={16} />,
        ].map((label, i) => (
          <span key={i} className="text-muted-foreground text-sm font-semibold">
            {label}
          </span>
        ))}
      </div>

      {/* Sets rows */}
      <div className="space-y-2">
        <WorkoutExerciseWidgetInputs measurements={fieldKeys} exercise={exercise} />
      </div>

      {/* Add set button */}
      <Button
        size="sm"
        variant="outline"
        className="mt-4 w-full gap-1"
        onClick={() => addSet(exercise.stableExerciseId)}
      >
        <PlusIcon size={16} />
        Add set
      </Button>
    </div>
  )
}
