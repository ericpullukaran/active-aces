"use client"

import React from "react"
import { Dumbbell } from "lucide-react"
import { type WorkoutHistoryExercise } from "~/lib/types/workout"
import ViewTemplateDialog from "./ViewTemplateDialog"

interface TemplateCardProps {
  template: WorkoutHistoryExercise
  children?: React.ReactNode
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <>
      <ViewTemplateDialog template={template}>
        <div className="bg-card flex h-28 flex-col justify-between rounded-2xl border p-4 shadow-sm">
          <div>
            <h4 className="line-clamp-2 text-base font-medium">{template.name}</h4>
            <div className="text-muted-foreground mt-2 flex items-center text-sm">
              <Dumbbell className="mr-1 h-4 w-4" />
              {template.workoutExercises.length} exercise
              {template.workoutExercises.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </ViewTemplateDialog>
    </>
  )
}
