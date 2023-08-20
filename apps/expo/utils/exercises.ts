import { trpc } from "./trpc";

export const useExercises = () => {
  const exercisesQuery = trpc.exercises.all.useQuery();

  const dataAsMap = exercisesQuery.data?.reduce((acc, exercise) => {
    acc[exercise.id] = exercise;
    return acc;
  }, {} as Record<string, (typeof exercisesQuery.data)[0]>);

  return {
    ...exercisesQuery,
    dataAsMap,
  };
};
