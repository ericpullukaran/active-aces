import { useInfiniteQuery } from "@tanstack/react-query"
import { useTRPC } from "../trpc/client"
import { type RouterInputs } from "../trpc/root"

export function useInfiniteHistory(
  opts: RouterInputs["workouts"]["history"]["infinite"] & { isTemplate?: boolean },
) {
  const trpc = useTRPC()

  const query = useInfiniteQuery({
    ...trpc.workouts.history.infinite.infiniteQueryOptions(opts),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    workouts: query.data?.pages.flatMap((page) => page.items) ?? [],
    totalCount: query.data?.pages.flatMap((page) => page.items).length ?? 0,
  }
}
