// src/components/ExerciseNotesDialog.tsx
"use client"

import React, { useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { workoutActions } from "~/lib/stores/workoutStore"

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

  const handleClose = () => {
    workoutActions.updateExerciseNotes(exerciseId, notes)
    onClose()
  }

  return (
    <ResponsiveDialog
      title="Exercise Notes"
      description="Add notes for this exercise"
      open={isOpen}
      onClose={handleClose}
      renderContent={() => (
        <div className="flex flex-col gap-4 p-4">
          <Textarea
            maxLength={500}
            placeholder="Add notes about this exercise..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24"
          />
        </div>
      )}
      renderFooter={() => (
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Close
        </Button>
      )}
    />
  )
}
