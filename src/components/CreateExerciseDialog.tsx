"use client"
import React, { useEffect, useState } from "react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MeasurementType } from "~/lib/db/types"
import { MeasurementTypeLabels } from "~/lib/utils/measurement"
import { type DbExercisesMap } from "~/lib/types/workout"
import { exerciseQueryKey } from "~/lib/utils/useExercises"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"

export const CreateExerciseDialog: React.FC<{
  initialName?: string
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose, initialName }) => {
  const [name, setName] = useState(initialName || "")
  const [description, setDescription] = useState("")
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState("")
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    MeasurementType.WEIGHT_REPS,
  )
  const [isCreating, setIsCreating] = useState(false)
  const { addExercise } = useWorkoutManager()
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    setName(initialName || "")
  }, [initialName, isOpen])

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const muscleGroupsQuery = useQuery(trpc.exercises.getAllMuscleGroups.queryOptions())
  const createExerciseMutation = useMutation(
    trpc.exercises.create.mutationOptions({
      onSuccess: (exercise) => {
        queryClient.invalidateQueries({ queryKey: [exerciseQueryKey] })
        if (!exercise) return
        queryClient.setQueryData([exerciseQueryKey], (data: DbExercisesMap) => {
          if (!data) return new Map().set(exercise.id, exercise)
          data.set(exercise.id, exercise)
          return data
        })
        addExercise(exercise.id)

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
      renderContent={() => (
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
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {measurementType
                    ? MeasurementTypeLabels[measurementType]
                    : "Select measurement type"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full min-w-[200px]">
                <DropdownMenuItem onClick={() => setMeasurementType(MeasurementType.REPS)}>
                  {MeasurementTypeLabels[MeasurementType.REPS]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMeasurementType(MeasurementType.WEIGHT_REPS)}>
                  {MeasurementTypeLabels[MeasurementType.WEIGHT_REPS]}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setMeasurementType(MeasurementType.WEIGHT_DISTANCE)}
                >
                  {MeasurementTypeLabels[MeasurementType.WEIGHT_DISTANCE]}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setMeasurementType(MeasurementType.WEIGHT_DURATION)}
                >
                  {MeasurementTypeLabels[MeasurementType.WEIGHT_DURATION]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMeasurementType(MeasurementType.TIME)}>
                  {MeasurementTypeLabels[MeasurementType.TIME]}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMeasurementType(MeasurementType.TIME_DISTANCE)}>
                  {MeasurementTypeLabels[MeasurementType.TIME_DISTANCE]}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryMuscleGroup">Primary Muscle Group</Label>
            <div className="relative">
              {!commandOpen && (
                <Button
                  variant="outline"
                  className="mb-[50px] w-full justify-between"
                  onClick={() => setCommandOpen(!commandOpen)}
                >
                  {primaryMuscleGroupId
                    ? muscleGroupsQuery.data?.find((g) => g.id === primaryMuscleGroupId)?.name ||
                      "Select primary muscle group"
                    : "Select primary muscle group"}
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              )}

              {commandOpen && (
                <div className="bg-popover absolute z-50 mt-1 w-full rounded-md border shadow-md">
                  <Command>
                    <CommandInput placeholder="Search muscle groups..." />
                    <CommandList className="max-h-[100px] overflow-y-auto">
                      <CommandEmpty>No muscle groups found.</CommandEmpty>
                      <CommandGroup>
                        {muscleGroupsQuery.isLoading ? (
                          <CommandItem disabled>Loading muscle groups...</CommandItem>
                        ) : (
                          muscleGroupsQuery.data?.map((group) => (
                            <CommandItem
                              key={group.id}
                              onSelect={() => {
                                setPrimaryMuscleGroupId(group.id)
                                console.log("setting primary muscle group", group.id)
                                setCommandOpen(false)
                              }}
                            >
                              {group.name}
                            </CommandItem>
                          ))
                        )}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
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
