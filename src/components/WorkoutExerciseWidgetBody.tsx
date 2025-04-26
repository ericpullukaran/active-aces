"use client"

import { PlusIcon, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { WorkoutExerciseWithMetadata } from "~/lib/types/workout"
import { MeasurementType } from "~/lib/db/types"
import { defaultExerciseSet } from "~/lib/utils/defaults"

const measurementFields = {
  weight: { label: "Weight" },
  reps: { label: "Reps" },
  time: { label: "Time" },
  distance: { label: "Distance" },
}
type MeasurementFieldKey = keyof typeof measurementFields

const exerciseTypeToFields: Record<MeasurementType, MeasurementFieldKey[]> = {
  [MeasurementType.WEIGHT_REPS]: ["weight", "reps"],
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
  const [sets, setSets] = useState(exercise.sets)

  const measurementType = exercise.metadata.measurementType
  const fieldKeys = exerciseTypeToFields[measurementType]

  const handleAddSet = () => {
    setSets([...sets, defaultExerciseSet()])
  }

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
        {sets.map((set, index) => (
          <div
            key={set.stableId}
            className="grid items-center gap-1"
            style={{
              gridTemplateColumns: `3rem ${fieldKeys.map(() => "1fr").join(" ")} 3rem`,
            }}
          >
            {/* Set number */}
            <div className="text-center font-medium">{index + 1}</div>

            {/* Input fields based on measurement type */}
            {fieldKeys.map((field) => (
              <div key={field} className="bg-muted h-10 rounded-md p-2 text-center">
                {set[field] || 0}
              </div>
            ))}

            {/* Completed checkbox */}
            <div className="flex justify-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${set.completed ? "bg-primary" : "bg-muted"}`}
              >
                {set.completed && <Check className="text-primary-foreground" size={16} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add set button */}
      <Button size="sm" variant="outline" className="mt-4 w-full gap-1" onClick={handleAddSet}>
        <PlusIcon size={16} />
        Add set
      </Button>
    </div>
  )
}
