import { useMemo } from "react";
import Fuse from "fuse.js";

import { api } from "~/trpc/react";

export const ONE_HOUR = 1000 * 60 * 60;

export const useExercises = (
  searchQuery?: string | undefined,
  filters?: string[] | undefined,
) => {
  const exercises = api.exercises.all.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ONE_HOUR,
  });

  const fuse = useMemo(() => {
    return new Fuse(exercises.data ?? [], {
      keys: ["name", "primaryMuscleGroupId"],
    });
  }, [exercises.data]);

  const filteredExercises = useMemo(() => {
    let results = exercises.data ?? [];

    if (searchQuery) {
      results = fuse.search(searchQuery).map((result) => result.item);
    }

    if (filters && filters.length > 0) {
      results = results.filter((exercise) =>
        filters.includes(exercise.primaryMuscleGroupId),
      );
    }

    return results;
  }, [searchQuery, exercises.data, fuse, filters]);

  return filteredExercises;
};
