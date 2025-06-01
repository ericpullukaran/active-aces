"use client"

import { PlusIcon, Check } from "lucide-react"
import { Button } from "./ui/button"
import { type DbExercise } from "~/lib/types/workout"
import WorkoutExerciseWidgetInputs from "./WorkoutExerciseWidgetInputs"
import { MEASUREMENT_FIELDS, getFieldKeys } from "~/lib/utils/measurement"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { memo } from "react"
import { useSnapshot } from "valtio"

export default memo(function WorkoutExerciseWidgetBody({
  stableExerciseId,
  exerciseMeta,
}: {
  stableExerciseId: string
  exerciseMeta: DbExercise
}) {
  const snap = useSnapshot(workoutStore)
  const observableExercise = snap.currentWorkout?.exercises.find(
    (ex) => ex.stableExerciseId === stableExerciseId,
  )

  if (!observableExercise) return null

  const measurementType = exerciseMeta.measurementType
  const fieldKeys = getFieldKeys(measurementType, {
    enableAssistedReps: observableExercise.enableAssistedReps,
    enableWeightedReps: observableExercise.enableWeightedReps,
  })

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
          ...fieldKeys.map((field) => MEASUREMENT_FIELDS[field].label),
          <Check key="check" className="mx-auto" size={16} />,
        ].map((label, i) => (
          <span key={i} className="text-muted-foreground text-sm font-semibold">
            {label}
          </span>
        ))}
      </div>

      {/* Sets rows */}
      <div className="space-y-2">
        <WorkoutExerciseWidgetInputs stableExerciseId={stableExerciseId} measurements={fieldKeys} />
      </div>

      {/* Add set button */}
      <Button
        size="sm"
        variant="outline"
        className="mt-4 w-full gap-1"
        onClick={() => workoutActions.addSet(observableExercise.stableExerciseId)}
      >
        <PlusIcon size={16} />
        Add set
      </Button>
    </div>
  )
})
