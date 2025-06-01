import { useExercises, type ExerciseFilterOptions } from "~/lib/utils/useExercises"
import { ExerciseCard } from "./ExerciseCard"
import { Skeleton } from "./ui/skeleton"
import { useMemo } from "react"
import { Plus } from "lucide-react"
import { workoutActions } from "~/lib/stores/workoutStore"
import { defaultWorkoutExercise } from "~/lib/utils/defaults"

export function AddExercisesList({
  searchQuery = "",
  filterOptions = { deleted: true },
  onCreateExercise,
}: {
  searchQuery?: string
  filterOptions?: ExerciseFilterOptions
  onCreateExercise?: (name: string) => void
}) {
  const { filteredExercises, isLoading } = useExercises(searchQuery, filterOptions)
  const addExercise = workoutActions.addExercise

  const exerciseElements = useMemo(() => {
    if (filteredExercises.length === 0) {
      if (searchQuery && !isLoading && onCreateExercise) {
        return (
          <>
            <div
              onClick={() => onCreateExercise(searchQuery)}
              className="hover:border-primary bg-card flex cursor-pointer items-center space-x-4 rounded-xl border p-4 text-left transition-all"
            >
              <div className="flex-1 flex-col space-y-2">
                <div className="flex items-center">
                  <p className="flex flex-1 items-center text-sm leading-none font-medium">
                    <Plus size={16} className="mr-2" />
                    Create &quot;{searchQuery}&quot;
                  </p>
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  Create a new custom exercise with this name
                </p>
              </div>
            </div>
            <div className="text-muted-foreground py-4 text-center">No other exercises found</div>
          </>
        )
      }
      return <div className="py-4 text-center">No exercises found</div>
    }

    return filteredExercises.map(([id, exercise]) => (
      <ExerciseCard
        key={id}
        inWorkout={true}
        exercise={exercise}
        onClick={() => addExercise(defaultWorkoutExercise(exercise.id))}
      />
    ))
  }, [filteredExercises, searchQuery, isLoading, onCreateExercise, addExercise])

  return (
    <div className="flex w-full flex-col gap-4">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}

      {!isLoading && exerciseElements}
    </div>
  )
}
