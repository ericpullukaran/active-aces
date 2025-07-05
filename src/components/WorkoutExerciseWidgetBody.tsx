"use client"

import { PlusIcon, Check, NotepadText, PenBox } from "lucide-react"
import { Button } from "./ui/button"
import { type DbExercise } from "~/lib/types/workout"
import WorkoutExerciseWidgetInputs from "./WorkoutExerciseWidgetInputs"
import { MEASUREMENT_FIELDS, getFieldKeys } from "~/lib/utils/measurement"
import { workoutActions, workoutStore } from "~/lib/stores/workoutStore"
import { memo, useState } from "react"
import { useSnapshot } from "valtio"
import ExerciseNotesDialog from "./ExerciseNotesDialog"
import { LayoutGroup, motion } from "motion/react"
import { cn } from "~/lib/utils"

export default memo(function WorkoutExerciseWidgetBody({
  stableExerciseId,
  exerciseMeta,
}: {
  stableExerciseId: string
  exerciseMeta: DbExercise
}) {
  const [showNotesDialog, setShowNotesDialog] = useState(false)
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

      <LayoutGroup>
        {/* Sets rows */}
        <WorkoutExerciseWidgetInputs stableExerciseId={stableExerciseId} measurements={fieldKeys} />

        {/* Add notes and set */}
        <motion.div className="flex items-center gap-2" layout>
          <Button
            size="sm"
            variant="outline"
            className={cn("mt-4 w-full gap-1")}
            style={
              observableExercise?.notes
                ? {
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }
                : undefined
            }
            onClick={() => setShowNotesDialog(true)}
          >
            {!observableExercise?.notes ? (
              <NotepadText className="mr-2 h-4 w-4" />
            ) : (
              <PenBox
                className={cn("mr-2 h-4 w-4", {
                  "text-primary": observableExercise?.notes,
                })}
              />
            )}
            {observableExercise?.notes ? "Edit notes" : "Add notes"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="mt-4 w-full gap-1"
            onClick={() => workoutActions.addSet(observableExercise.stableExerciseId)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add set
          </Button>
        </motion.div>
      </LayoutGroup>

      {/* External Exercise Notes Dialog */}
      <ExerciseNotesDialog
        exerciseId={observableExercise.stableExerciseId}
        initialNotes={observableExercise.notes || ""}
        isOpen={showNotesDialog}
        onClose={() => setShowNotesDialog(false)}
      />
    </div>
  )
})
