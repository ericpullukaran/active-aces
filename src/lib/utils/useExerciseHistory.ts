import { useQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"

export type UseExerciseHistoryOptions = {
  exerciseId: string
  limit?: number
}

export function useExerciseHistory({ exerciseId, limit = 10 }: UseExerciseHistoryOptions) {
  const trpc = useTRPC()

  return useQuery(
    trpc.workouts.history.exercise.queryOptions({
      exerciseId,
      limit,
    }),
  )
}
