"use client"

import React, { useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { TimeInput } from "./ui/time-input"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { formatTimeValue, parseTimeToSeconds } from "~/lib/utils/dates"

type CustomizeTimerDialogProps = {
  exerciseId: string
  initialTimer?: number | null
  isOpen: boolean
  onClose: () => void
}

export default function CustomizeTimerDialog({
  exerciseId,
  initialTimer,
  isOpen,
  onClose,
}: CustomizeTimerDialogProps) {
  const [timer, setTimer] = useState(initialTimer ?? 0)
  const { updateExerciseSettings } = useWorkoutManager()

  const handleSave = () => {
    updateExerciseSettings(exerciseId, { restTimeSeconds: timer })
    onClose()
  }

  const handleClear = () => {
    updateExerciseSettings(exerciseId, { restTimeSeconds: undefined })
    onClose()
  }

  return (
    <ResponsiveDialog
      title="Customize Timer"
      description="Set the rest timer for this exercise"
      open={isOpen}
      onClose={onClose}
      renderContent={() => (
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col items-center">
            <p className="text-muted-foreground mb-2 text-xs">
              Format: {timer > 3600 ? "HH:MM:SS" : "MM:SS"}
            </p>
            <TimeInput
              className="w-48 text-2xl"
              value={initialTimer ? formatTimeValue(initialTimer) : ""}
              onBlur={(value) => setTimer(parseTimeToSeconds(value))}
            />
          </div>
        </div>
      )}
      renderFooter={() => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClear} className="flex-1">
            Clear
          </Button>
          <Button variant="default" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      )}
    />
  )
}
