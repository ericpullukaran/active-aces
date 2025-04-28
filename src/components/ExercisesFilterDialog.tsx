"use client"
import React, { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Checkbox } from "./ui/checkbox"
import { ExerciseFilterOptions } from "~/lib/utils/useExercises"

export const useFilters = (
  initalFilters: ExerciseFilterOptions = {
    muscleGroups: [],
    onlyMine: false,
  },
) => {
  const [filters, setFilters] = useState<ExerciseFilterOptions>(initalFilters)
  const hasFiltersApplied =
    (filters.muscleGroups && filters.muscleGroups.length > 0) || filters.onlyMine

  return { filters, setFilters, hasFiltersApplied }
}

export const ExercisesFilterDialog: React.FC<{
  isOpen: boolean
  onClose: () => void
  filters: ExerciseFilterOptions
  onApplyFilters: (filters: ExerciseFilterOptions) => void
}> = ({ isOpen, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState<ExerciseFilterOptions>(filters)
  const trpc = useTRPC()
  const muscleGroupsQuery = useQuery(trpc.exercises.getAllMuscleGroups.queryOptions())

  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters)
    }
  }, [isOpen, filters])

  const handleMuscleGroupToggle = (id: string) => {
    setLocalFilters((prev) => {
      const muscleGroups = prev.muscleGroups?.includes(id)
        ? prev.muscleGroups.filter((groupId) => groupId !== id)
        : [...(prev.muscleGroups || []), id]

      return { ...prev, muscleGroups }
    })
  }

  const handleOnlyMineToggle = () => {
    setLocalFilters((prev) => ({ ...prev, onlyMine: !prev.onlyMine }))
  }

  const handleReset = () => {
    onApplyFilters({ muscleGroups: [], onlyMine: false })
    onClose()
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Filter Exercises</DialogTitle>
          <DialogDescription>
            Filter exercises by muscle group or show only your custom exercises
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium">My Exercises</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="only-mine"
                checked={localFilters.onlyMine || false}
                onCheckedChange={handleOnlyMineToggle}
              />
              <Label htmlFor="only-mine">Show only my exercises</Label>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium">Muscle Groups</h3>
            <div className="grid grid-cols-2 gap-2">
              {muscleGroupsQuery.isLoading ? (
                <div className="text-muted-foreground col-span-2 text-sm">
                  Loading muscle groups...
                </div>
              ) : (
                muscleGroupsQuery.data?.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`muscle-${group.id}`}
                      checked={localFilters.muscleGroups?.includes(group.id) || false}
                      onCheckedChange={() => handleMuscleGroupToggle(group.id)}
                    />
                    <Label htmlFor={`muscle-${group.id}`}>{group.name}</Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 pb-2">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
