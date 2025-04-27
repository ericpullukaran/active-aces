import { useExercises } from "~/lib/utils/useExercises"
import { ExerciseCard } from "./ExerciseCard"
import { Skeleton } from "./ui/skeleton"
import { useMemo } from "react"

export function AddExercisesList({ searchQuery = "" }: { searchQuery?: string }) {
  const { filteredExercises, isLoading } = useExercises(searchQuery)

  const exerciseElements = useMemo(() => {
    if (filteredExercises.length === 0) {
      return <div className="py-4 text-center">No exercises found</div>
    }

    return filteredExercises.map(([id, exercise]) => (
      <ExerciseCard key={id} inWorkout={true} exercise={exercise} />
    ))
  }, [filteredExercises])

  return (
    <div className="flex flex-col gap-4">
      {isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}

      {!isLoading && exerciseElements}
    </div>
  )
}
