"use client"
import React, { useEffect, useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MeasurementType } from "~/lib/db/types"

export const CreateExerciseDialog: React.FC<{
  initialName?: string
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose, initialName }) => {
  console.log("initialName", initialName)
  const [name, setName] = useState(initialName || "")
  const [description, setDescription] = useState("")
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState("")
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    MeasurementType.WEIGHT_REPS,
  )
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    setName(initialName || "")
  }, [initialName, isOpen])

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const muscleGroupsQuery = useQuery(trpc.exercises.getAllMuscleGroups.queryOptions())
  const createExerciseMutation = useMutation(
    trpc.exercises.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [trpc.exercises.getAll.queryKey()],
        })

        // Reset form
        setName("")
        setDescription("")
        setPrimaryMuscleGroupId("")
        setMeasurementType(MeasurementType.WEIGHT_REPS)

        onClose()
      },
      onSettled: () => {
        setIsCreating(false)
      },
    }),
  )

  const handleCreateExercise = () => {
    if (!name) {
      return
    }

    setIsCreating(true)

    createExerciseMutation.mutate({
      name,
      description: description || undefined,
      measurementType,
      primaryMuscleGroupId: primaryMuscleGroupId || undefined,
    })
  }

  return (
    <ResponsiveDialog
      title="Create Exercise"
      description="Add a new custom exercise to your library"
      isOpen={isOpen}
      onClose={onClose}
      renderContent={({ closeDialog }) => (
        <div className="flex flex-col gap-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="name">Exercise Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barbell Squat"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the exercise"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="measurementType">Measurement Type</Label>
            <Select
              value={measurementType}
              onValueChange={(value: MeasurementType) => setMeasurementType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select measurement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-reps">Weight & Reps</SelectItem>
                <SelectItem value="reps">Reps Only</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="time">Time</SelectItem>
                <SelectItem value="time-distance">Time & Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryMuscleGroup">Primary Muscle Group</Label>
            <Select value={primaryMuscleGroupId} onValueChange={setPrimaryMuscleGroupId}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary muscle group" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroupsQuery.isLoading ? (
                  <SelectItem value="" disabled>
                    Loading muscle groups...
                  </SelectItem>
                ) : (
                  muscleGroupsQuery.data?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      renderFooter={({ closeDialog }) => (
        <div className="flex gap-2">
          <Button variant="outline" onClick={closeDialog} className="flex-1" disabled={isCreating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateExercise}
            className="flex-1 gap-2"
            disabled={isCreating || !name}
            isLoading={isCreating}
          >
            {isCreating ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      )}
    />
  )
}
