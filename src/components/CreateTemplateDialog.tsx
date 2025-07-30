import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type PutWorkout } from "~/lib/types/workout"
import { CheckCircleIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { trackTemplate } from "~/lib/utils/analytics"

interface CreateTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: PutWorkout | null
}

export default function CreateTemplateDialog({
  open,
  onOpenChange,
  workout,
}: CreateTemplateDialogProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const [templateName, setTemplateName] = useState("")
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  const putWorkoutMutation = useMutation(
    trpc.workouts.put.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.workouts.history.infiniteTemplates.pathKey(),
          refetchType: "all",
        })
      },
    }),
  )

  const handleCreateTemplate = () => {
    if (!workout) return

    putWorkoutMutation.mutate(
      {
        workout: {
          ...workout,
          name: templateName || "Untitled Template",
          isTemplate: true,
        },
      },
      {
        onSuccess: (result) => {
          trackTemplate.created({
            template_name: templateName || "Untitled Template",
            exercise_count: workout?.exercises.length,
            template_id: result?.id,
          })
          setShowSuccessOverlay(true)
          // Close after 2 seconds
          setTimeout(() => {
            setShowSuccessOverlay(false)
            onOpenChange(false)
            setTemplateName("")
          }, 2000)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="relative">
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

          {/* Success Overlay */}
          <AnimatePresence>
            {showSuccessOverlay && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-background/70 absolute inset-0 z-50 flex items-center justify-center rounded-4xl backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500" />
                  <div className="text-2xl font-semibold text-green-600">Success</div>
                  <div className="text-muted-foreground text-sm">
                    Template created successfully!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </div>
    </Dialog>
  )
}
