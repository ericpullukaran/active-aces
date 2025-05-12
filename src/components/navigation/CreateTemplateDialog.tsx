import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { historyQueryKey } from "../dashboard-screen/HistoryScreen"
import { recentWorkoutsQueryKey } from "../RecentWorkoutsCard"
import { useWorkoutManager } from "../dashboard-screen/WorkoutManagerProvider"
import { type PutWorkout } from "~/lib/types/workout"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentWorkout: PutWorkout | null
}

export default function CreateTemplateDialog({
  open,
  onOpenChange,
  currentWorkout,
}: CreateTemplateDialogProps) {
  const [templateName, setTemplateName] = useState("")
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { removeCurrentWorkout, setCurrentPage } = useWorkoutManager()

  const putWorkoutMutation = useMutation(trpc.workouts.put.mutationOptions())

  const handleCreateTemplate = () => {
    if (!currentWorkout) return

    putWorkoutMutation.mutate(
      {
        workout: {
          ...currentWorkout,
          name: templateName || "Untitled Template",
          isTemplate: true,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [historyQueryKey] })
          queryClient.invalidateQueries({ queryKey: [recentWorkoutsQueryKey] })
          removeCurrentWorkout()
          setCurrentPage("home")
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a template from this workout that you can use in the future.
        </DialogDescription>
        <div className="py-4">
          <div className="mb-2 text-sm font-medium">Template Name</div>
          <Input
            placeholder="My Workout Template"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            maxLength={100}
          />
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            disabled={putWorkoutMutation.isPending || templateName === ""}
            onClick={handleCreateTemplate}
            isLoading={putWorkoutMutation.isPending}
          >
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
