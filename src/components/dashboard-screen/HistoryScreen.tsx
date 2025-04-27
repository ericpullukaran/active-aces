"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useTRPC } from "~/lib/trpc/client"
import { useEffect, useRef } from "react"
import WorkoutHistoryCard from "../WorkoutHistoryCard"
import { Skeleton } from "../ui/skeleton"

export default function HistoryScreen() {
  const trpc = useTRPC()
  const observerTarget = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery({
      ...trpc.workouts.historyInfinite.infiniteQueryOptions({
        limit: 10,
      }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    })

  // Setup infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-8 pt-20">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="text-destructive">Failed to load workout history</div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 py-10 pb-20">
      <h1 className="text-2xl font-bold">Workout History</h1>

      <div className="flex w-full flex-col gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="bg-card h-32 w-full rounded-xl" />
            ))
          : data?.pages.map((page) =>
              page.items.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              )),
            )}

        {isFetchingNextPage && <Skeleton className="bg-card h-32 w-full rounded-xl" />}

        {/* Observer target element */}
        <div ref={observerTarget} className="h-4" />
      </div>
    </div>
  )
}
