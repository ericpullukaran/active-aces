// src/components/ExerciseNotesDialog.tsx
"use client"

import React, { useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

type ExerciseNotesDialogProps = {
  exerciseId: string
  initialNotes?: string
  isOpen: boolean
  onClose: () => void
}

export default function ExerciseNotesDialog({
  exerciseId,
  initialNotes = "",
  isOpen,
  onClose,
}: ExerciseNotesDialogProps) {
  const [notes, setNotes] = useState(initialNotes)
  const { updateExerciseSettings } = useWorkoutManager()

  const handleSave = () => {
    updateExerciseSettings(exerciseId, { notes })
    onClose()
  }

  return (
    <ResponsiveDialog
      title="Exercise Notes"
      description="Add notes for this exercise"
      isOpen={isOpen}
      onClose={onClose}
      renderContent={() => (
        <div className="flex flex-col gap-4 p-4">
          <Textarea
            placeholder="Add notes about this exercise..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24"
          />
        </div>
      )}
      renderFooter={() => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave} className="flex-1">
            Save
          </Button>
        </div>
      )}
    />
  )
}
