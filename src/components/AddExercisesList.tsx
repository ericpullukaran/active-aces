import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"
import { ExerciseCard } from "./ExerciseCard"
import { Skeleton } from "./ui/skeleton"
import { useMemo } from "react"

export function AddExercisesList() {
  const trpc = useTRPC()
  const exercises = useQuery(trpc.exercises.getAll.queryOptions())

  const exerciseElements = useMemo(() => {
    if (!exercises.data) return null

    return Array.from(exercises.data).map(([id, exercise]) => (
      <ExerciseCard key={id} inWorkout={true} exercise={exercise} />
    ))
  }, [exercises.data])

  return (
    <div className="flex flex-col gap-4 pb-20">
      {exercises.isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}

      {exerciseElements}
    </div>
  )
}
