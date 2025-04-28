import { ExerciseCard } from "./ExerciseCard"
import { useMemo, useState } from "react"
import { Skeleton } from "./ui/skeleton"
import { useExercises, ExerciseFilterOptions } from "~/lib/utils/useExercises"
import { ListFilter } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "~/lib/utils"
import { ExercisesFilterDialog, useFilters } from "./ExercisesFilterDialog"

export function ExercisesList() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { filters, setFilters, hasFiltersApplied } = useFilters()
  const { filteredExercises, isLoading } = useExercises("", filters)

  const exerciseElements = useMemo(() => {
    if (!filteredExercises || filteredExercises.length === 0) {
      return <div className="text-muted-foreground py-4 text-center">No exercises found</div>
    }

    return filteredExercises.map(([id, exercise]) => (
      <ExerciseCard key={id} inWorkout={false} exercise={exercise} />
    ))
  }, [filteredExercises])

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}
      {!isLoading && exerciseElements}

      <Button
        variant="outline"
        className={cn("fixed right-4 bottom-28 rounded-full", {
          "border-primary text-primary": hasFiltersApplied,
        })}
        Icon={ListFilter}
        onClick={() => setIsFilterOpen(true)}
      />

      <ExercisesFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  )
}
