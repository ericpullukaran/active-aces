import { useMemo } from "react";
import Fuse from "fuse.js";

import { api } from "~/trpc/react";

const ONE_HOUR = 1000 * 60 * 60;

export const useExercises = (searchQuery?: string | undefined) => {
  const exercises = api.exercises.all.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ONE_HOUR,
  });

  const fuse = useMemo(() => {
    return new Fuse(exercises.data ?? [], {
      keys: ["name"],
    });
  }, [exercises.data]);

  const filteredExercises = useMemo(() => {
    if (!searchQuery) {
      return exercises.data ?? [];
    }

    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, exercises.data, fuse]);

  return filteredExercises;
};
