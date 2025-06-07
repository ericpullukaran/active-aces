// src/components/ExerciseNotesDialog.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { workoutActions } from "~/lib/stores/workoutStore"
import { Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

type ExerciseNotesDialogProps = {
  exerciseId: string
  initialNotes?: string
  isOpen: boolean
  onClose: () => void
  setNumber?: number | null
}

export default function ExerciseNotesDialog({
  exerciseId,
  initialNotes = "",
  isOpen,
  onClose,
  setNumber,
}: ExerciseNotesDialogProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && setNumber) {
      const setNotation = `${initialNotes !== "" && !initialNotes.endsWith("\n") ? "\n" : ""}[Set ${setNumber}]: `
      const newNotes = initialNotes + setNotation
      setNotes(newNotes)
    } else if (isOpen && !setNumber) {
      setNotes(initialNotes)
    }
  }, [isOpen, setNumber, initialNotes])

  const handleClose = () => {
    workoutActions.updateExerciseNotes(exerciseId, notes)
    onClose()
  }

  const handleDelete = () => {
    setShowDeleteConfirmation(true)
  }

  const confirmDelete = () => {
    workoutActions.updateExerciseNotes(exerciseId, "")
    setShowDeleteConfirmation(false)
    onClose()
  }

  return (
    <>
      <ResponsiveDialog
        title="Exercise Notes"
        description="Add notes for this exercise"
        open={isOpen}
        onClose={handleClose}
        headerAction={() => (
          <Button variant="ghost" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        )}
        renderContent={() => (
          <div className="flex flex-col gap-4 p-4">
            <Textarea
              ref={textareaRef}
              maxLength={500}
              placeholder="Add notes about this exercise..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-80"
            />
          </div>
        )}
        renderFooter={() => (
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Close
          </Button>
        )}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent
          onClick={(e) => e.stopPropagation()}
          onClose={() => setShowDeleteConfirmation(false)}
        >
          <DialogHeader>
            <DialogTitle>Clear Notes</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear all notes for this exercise? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={confirmDelete}>
              Clear Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
