import { useMemo, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Fuse from "fuse.js"
import { useTRPC } from "~/lib/trpc/client"
import { DbExercise } from "~/lib/types/workout"

export function useExercises(searchQuery: string = "", filters?: string[]) {
  const trpc = useTRPC()
  const exercises = useQuery(trpc.exercises.getAll.queryOptions())

  const [filteredExercises, setFilteredExercises] = useState<[string, DbExercise][]>([])

  const fuse = useMemo(() => {
    if (!exercises.data) return null

    const exerciseArray = Array.from(exercises.data).map(([id, exercise]) => ({
      id,
      exercise,
    }))

    return new Fuse(exerciseArray, {
      keys: [
        {
          name: "exercise.name",
          weight: 0.7,
        },
        {
          name: "exercise.primaryMuscleGroup.name",
          weight: 0.3,
        },
      ],
      threshold: 0.4,
      includeScore: true,
    })
  }, [exercises.data])

  useEffect(() => {
    if (!exercises.data) return

    let results = Array.from(exercises.data) as [string, DbExercise][]

    // Apply search query filtering
    if (searchQuery && searchQuery.trim() !== "" && fuse) {
      const searchResults = fuse.search(searchQuery)
      results = searchResults.map<[string, DbExercise]>((result) => [
        result.item.id,
        result.item.exercise,
      ])
    }

    // Apply additional filters if provided
    if (filters && filters.length > 0) {
      results = results.filter(([_, exercise]) =>
        filters.includes(exercise.primaryMuscleGroup?.id || ""),
      )
    }

    setFilteredExercises(results)
  }, [searchQuery, exercises.data, fuse, filters])

  return {
    filteredExercises,
    isLoading: exercises.isLoading,
    isError: exercises.isError,
    error: exercises.error,
    // Return the raw data as well in case it's needed
    rawData: exercises.data,
  }
}
