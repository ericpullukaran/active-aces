"use client";

import React, { startTransition } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { api } from "~/trpc/react";
import { useExercises } from "~/utils/use-search-exercises";
import { WhenHydrated } from "./WhenHydrated";

export default function StartWorkoutButton() {
  const { currentWorkout, startWorkout } = useCurrentWorkout();
  const workoutInProgress = !!currentWorkout;

  // prefetch exercises
  useExercises();

  return (
    <Link
      href="/dashboard/workout"
      className={cn(
        " flex items-center rounded-lg border-2 bg-card p-2 pl-4 ring-1 ring-primary/50 transition-all",
      )}
      onClick={() => {
        if (!currentWorkout) {
          startTransition(() => {
            startWorkout();
          });
        }
      }}
    >
      <WhenHydrated
        fallback={
          <div className="mr-4 h-6 w-8 animate-pulse rounded-lg bg-zinc-600"></div>
        }
      >
        <div className="mr-4 flex-1 font-semibold transition-all">
          {workoutInProgress ? "Continue" : "Start workout"}
        </div>
      </WhenHydrated>
      <div className="flex -space-x-3 [&>*]:animate-pulse">
        <ChevronRight style={{ animationDelay: "0" }} />
        <ChevronRight style={{ animationDelay: "250ms" }} />
        <ChevronRight style={{ animationDelay: "500ms" }} />
      </div>
    </Link>
  );
}
