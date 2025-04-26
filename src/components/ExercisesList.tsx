import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"
import { ExerciseCard } from "./ExerciseCard"
import { Skeleton } from "./ui/skeleton"

export function ExercisesList() {
  const trpc = useTRPC()
  const exercises = useQuery(trpc.exercises.getAll.queryOptions())

  return (
    <div className="flex flex-col gap-4">
      {exercises.isLoading &&
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="h-[100px] w-full" />
        ))}
      {exercises.data?.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} onClick={() => {}} />
      ))}
    </div>
  )
}
