"use client"

import React from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import ExerciseDetailDialog from "./ExerciseDetailDialog"
import { type DbExercise } from "~/lib/types/workout"

type ExerciseHistoryDialogProps = {
  exercise: DbExercise
  isOpen: boolean
  onClose: () => void
}

export default function ExerciseHistoryDialog({
  exercise,
  isOpen,
  onClose,
}: ExerciseHistoryDialogProps) {
  return (
    <ResponsiveDialog
      title="Exercise History"
      open={isOpen}
      onClose={onClose}
      renderContent={() => (
        <div className="p-4">
          <ExerciseDetailDialog
            exercise={exercise}
            isOpen={isOpen}
            onClose={onClose}
            initialTab="history"
          />
        </div>
      )}
    />
  )
}
