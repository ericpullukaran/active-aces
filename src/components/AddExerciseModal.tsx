"use client"
import React from "react"
import { Search } from "lucide-react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { AddExercisesList } from "./AddExercisesList"
import { Button } from "./ui/button"

export const AddExerciseModal: React.FC<{
  children: (props: { openDialog: () => void }) => React.ReactNode
}> = ({ children }) => {
  return (
    <ResponsiveDialog
      title="Add Exercise"
      description="Add a new exercise to your workout"
      renderTrigger={({ openDialog }) => children({ openDialog })}
      renderContent={({ closeDialog }) => (
        <div className="h-full p-4">
          <AddExercisesList />
        </div>
      )}
      renderFooter={({ closeDialog }) => (
        <div className="flex gap-2">
          <Button variant={"outline"} onClick={closeDialog} className="flex-1">
            Dismiss
          </Button>
          <Button variant={"secondary"} Icon={Search} className="flex-1">
            Search
          </Button>
        </div>
      )}
    />
  )
}
