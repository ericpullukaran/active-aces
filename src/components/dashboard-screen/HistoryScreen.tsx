"use client"

import { useIntersectionObserver } from "~/lib/utils/useIntersectionObserver"
import WorkoutHistoryCard from "../WorkoutHistoryCard"
import { Skeleton } from "../ui/skeleton"
import { AnimatePresence } from "motion/react"
import { useInfiniteHistory } from "~/lib/utils/useInfiniteHistory"

export default function HistoryScreen() {
  const historyQuery = useInfiniteHistory({ limit: 10 })
  const observerTargetRef = useIntersectionObserver(() => {
    historyQuery.fetchNextPage()
  }, historyQuery.hasNextPage)

  if (historyQuery.isError) {
    return (
      <div className="flex flex-col items-center gap-8 pt-20">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="text-destructive">Failed to load workout history</div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 py-10 pb-32">
      <h1 className="text-2xl font-bold">Workout History</h1>

      <div className="flex w-full flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {historyQuery.isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="bg-card h-32 w-full rounded-xl" />
              ))
            : historyQuery.workouts.map((workout) => (
                <WorkoutHistoryCard key={workout.id} workout={workout} />
              ))}
        </AnimatePresence>
        {historyQuery.isFetchingNextPage && <Skeleton className="bg-card h-32 w-full rounded-xl" />}

        {historyQuery.hasNextPage && <div ref={observerTargetRef} className="h-4" />}
      </div>
    </div>
  )
}
