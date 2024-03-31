"use client";

import React, { startTransition } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { api } from "~/trpc/react";

export default function StartWorkoutButton() {
  const { currentWorkout, startWorkout } = useCurrentWorkout();
  const workoutInProgress = !!currentWorkout;

  // prefetch exercises
  api.exercises.all.useQuery();

  return (
    <Link
      href="/dashboard/workout"
      className={cn(
        "absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center rounded-xl bg-card p-2 pl-4 ring-primary transition-all hover:ring-2",
      )}
      onClick={() => {
        if (!currentWorkout) {
          startTransition(() => {
            startWorkout();
          });
        }
      }}
    >
      <div className="mr-4 flex-1 font-semibold transition-all">
        {workoutInProgress ? "Continue" : "Start workout"}
      </div>
      <div className="flex -space-x-3 transition-all [&>*]:animate-pulse">
        <ChevronRight style={{ animationDelay: "0" }} />
        <ChevronRight style={{ animationDelay: "250ms" }} />
        <ChevronRight style={{ animationDelay: "500ms" }} />
      </div>
    </Link>
  );
}
