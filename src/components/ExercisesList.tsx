import { ExerciseCard } from "./ExerciseCard"
import { useMemo, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { useExercises, ExerciseFilterOptions } from "~/lib/utils/useExercises"
import { ListFilter } from "lucide-react"
import { Button } from "./ui/button"
import ResponsiveDialog from "./ui/ResponsiveDialog"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { useTRPC } from "~/lib/trpc/client"
import { useQuery } from "@tanstack/react-query"

export function ExercisesList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ExerciseFilterOptions>({
    muscleGroups: [],
    onlyMine: false,
  })

  const trpc = useTRPC()
  const muscleGroupsQuery = useQuery(trpc.exercises.getAllMuscleGroups.queryOptions())
  const { filteredExercises, isLoading } = useExercises("", filters)

  const exerciseElements = useMemo(() => {
    if (!filteredExercises || filteredExercises.length === 0) {
      return <div className="text-muted-foreground py-4 text-center">No exercises found</div>
    }

    return filteredExercises.map(([id, exercise]) => (
      <ExerciseCard key={id} inWorkout={false} exercise={exercise} />
    ))
  }, [filteredExercises])

  const handleMuscleGroupToggle = (id: string) => {
    setFilters((prev) => {
      const muscleGroups = prev.muscleGroups?.includes(id)
        ? prev.muscleGroups.filter((groupId) => groupId !== id)
        : [...(prev.muscleGroups || []), id]

      return { ...prev, muscleGroups }
    })
  }

  const handleDismiss = () => {
    setIsFilterOpen(false)
  }

  const handleOnlyMineToggle = () => {
    setFilters((prev) => ({ ...prev, onlyMine: !prev.onlyMine }))
  }

  const handleReset = () => {
    setFilters({ muscleGroups: [], onlyMine: false })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}
      {!isLoading && exerciseElements}

      <Button
        variant="outline"
        className="fixed right-4 bottom-24 rounded-full"
        Icon={ListFilter}
        onClick={() => setIsFilterOpen(true)}
      />

      <ResponsiveDialog
        title="Filter Exercises"
        description="Filter exercises by muscle group or show only your custom exercises"
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        renderContent={({ closeDialog }) => (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium">My Exercises</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="only-mine"
                  checked={filters.onlyMine || false}
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
                        checked={filters.muscleGroups?.includes(group.id) || false}
                        onCheckedChange={() => handleMuscleGroupToggle(group.id)}
                      />
                      <Label htmlFor={`muscle-${group.id}`}>{group.name}</Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        renderFooter={({ closeDialog }) => (
          <div className="flex justify-between gap-4">
            <Button variant="outline" className="flex-1 border-red-700" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleDismiss}>
              Dismiss
            </Button>
          </div>
        )}
      />
    </div>
  )
}
