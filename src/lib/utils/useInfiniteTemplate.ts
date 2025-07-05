import { useInfiniteQuery } from "@tanstack/react-query"
import { useTRPC } from "../trpc/client"
import { type RouterInputs } from "../trpc/root"

export function useInfiniteTemplates(
  opts: RouterInputs["workouts"]["history"]["infiniteTemplates"],
) {
  const trpc = useTRPC()

  const query = useInfiniteQuery({
    ...trpc.workouts.history.infiniteTemplates.infiniteQueryOptions(opts),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    templates: query.data?.pages.flatMap((page) => page.items) ?? [],
    totalCount: query.data?.pages.flatMap((page) => page.items).length ?? 0,
  }
}
