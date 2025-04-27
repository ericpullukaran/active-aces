"use client"
import React, { useState, useRef, useEffect } from "react"
import { Search, X, Plus, ListFilter } from "lucide-react"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { AddExercisesList } from "./AddExercisesList"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { motion, AnimatePresence } from "motion/react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useTRPC } from "~/lib/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MeasurementType } from "~/lib/db/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Checkbox } from "./ui/checkbox"
import { ExerciseFilterOptions } from "~/lib/utils/useExercises"
import { cn } from "~/lib/utils"

const CreateExerciseModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [primaryMuscleGroupId, setPrimaryMuscleGroupId] = useState("")
  const [measurementType, setMeasurementType] = useState<MeasurementType>(
    MeasurementType.WEIGHT_REPS,
  )
  const [isCreating, setIsCreating] = useState(false)

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
                <SelectItem value="distance-time">Distance & Time</SelectItem>
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
          >
            {isCreating ? "Creating..." : "Create Exercise"}
          </Button>
        </div>
      )}
    />
  )
}

// Filter Dialog Component
const FilterDialog: React.FC<{
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

export const AddExerciseModal: React.FC<{
  children: (props: { openDialog: () => void }) => React.ReactNode
}> = ({ children }) => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isAddExerciseOpen, setIsAddExerciseOpen] = useState(false)
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ExerciseFilterOptions>({})

  const hasFiltersApplied =
    (filters.muscleGroups && filters.muscleGroups.length > 0) || filters.onlyMine

  const toggleSearch = () => {
    if (isSearching) {
      setSearchQuery("")
    }
    setIsSearching(!isSearching)
  }

  useEffect(() => {
    if (isSearching && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearching])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
  }

  const openCreateExercise = () => {
    setIsAddExerciseOpen(false)
    setIsCreateExerciseOpen(true)
  }

  const openFilters = () => {
    setIsFilterOpen(true)
  }

  const handleApplyFilters = (newFilters: ExerciseFilterOptions) => {
    setFilters(newFilters)
  }

  return (
    <>
      {children({ openDialog: () => setIsAddExerciseOpen(true) })}

      <ResponsiveDialog
        title="Add Exercise"
        description="Add a new exercise to your workout"
        isOpen={isAddExerciseOpen}
        onClose={() => setIsAddExerciseOpen(false)}
        renderContent={({ closeDialog }) => (
          <div className="h-full p-4">
            <AnimatePresence>
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative mb-4"
                >
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search exercises..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pr-8"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute top-1/2 right-2 -translate-y-1/2"
                    >
                      <X size={16} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            <AddExercisesList searchQuery={searchQuery} filterOptions={filters} />
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className="flex gap-2">
            <Button variant="outline" onClick={openCreateExercise} className="flex-1 gap-2">
              <Plus size={18} />
              Create
            </Button>
            <Button variant="secondary" onClick={toggleSearch} className="flex-2 gap-2">
              <Search size={18} />
              {isSearching ? "Close Search" : "Search"}
            </Button>
            <Button
              variant="outline"
              onClick={openFilters}
              className={cn("flex-1 gap-2", { "border-primary text-primary": hasFiltersApplied })}
            >
              <ListFilter size={18} />
              Filters
            </Button>
          </div>
        )}
      />

      <CreateExerciseModal
        isOpen={isCreateExerciseOpen}
        onClose={() => setIsCreateExerciseOpen(false)}
      />

      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </>
  )
}
