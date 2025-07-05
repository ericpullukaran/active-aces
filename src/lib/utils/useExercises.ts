import { useMemo, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import Fuse from "fuse.js"
import { useTRPC } from "~/lib/trpc/client"
import { type DbExercise } from "~/lib/types/workout"

export type ExerciseFilterOptions = {
  muscleGroups?: string[]
  onlyMine?: boolean
  deleted?: boolean
}

export function useExercises(searchQuery: string = "", filterOptions?: ExerciseFilterOptions) {
  const trpc = useTRPC()
  const exercises = useQuery({
    ...trpc.exercises.all.queryOptions(),
    staleTime: 1000 * 60 * 60 * 24 * 15,
  })

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

    // Apply muscle group filters if provided
    if (filterOptions?.muscleGroups && filterOptions.muscleGroups.length > 0) {
      results = results.filter(([_, exercise]) =>
        filterOptions.muscleGroups?.includes(exercise.primaryMuscleGroup?.id || ""),
      )
    }

    // Apply creator filter if onlyMine is true
    if (filterOptions?.onlyMine) {
      results = results.filter(([_, exercise]) => exercise.creatorId !== null)
    }

    // Apply deleted filter if provided
    if (filterOptions?.deleted !== undefined) {
      results = results.filter(([_, exercise]) => exercise.deleted === filterOptions.deleted)
    }

    setFilteredExercises(results)
  }, [searchQuery, exercises.data, fuse, filterOptions])

  return {
    filteredExercises,
    isLoading: exercises.isLoading,
    isError: exercises.isError,
    error: exercises.error,
    // Return the raw data as well in case it's needed
    rawData: exercises.data,
  }
}
