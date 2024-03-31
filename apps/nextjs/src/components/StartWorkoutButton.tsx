"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Loader2, Play } from "lucide-react";

import { cn } from "~/lib/cn";
import { api } from "~/trpc/react";

type Props = { workoutInProgress: boolean };

export default function StartWorkoutButton({
  workoutInProgress = false,
}: Props) {
  const putWorkout = api.workouts.put.useMutation();

  return (
    <Link
      href="/dashboard/workout"
      className={cn(
        "absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center rounded-xl bg-card p-2 ring-primary transition-all hover:ring-2",
        { "w-64": !putWorkout.isPending },
      )}
    >
      <div
        className={cn(
          "grid h-11 w-11 place-content-center rounded-lg bg-primary pr-0.5",
          {
            "border-2 border-primary bg-transparent": workoutInProgress,
          },
        )}
      >
        {putWorkout.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin stroke-card" />
        ) : (
          <Play
            className={cn("h-5 w-5 fill-card stroke-card", {
              "fill-white stroke-white": workoutInProgress,
            })}
          />
        )}
      </div>
      <div
        className={cn("ml-3 flex-1 font-semibold transition-all", {
          hidden: putWorkout.isPending,
        })}
      >
        {workoutInProgress ? "Continue" : "Start workout"}
      </div>
      <div
        className={cn("mr-2 flex transition-all", {
          hidden: putWorkout.isPending,
        })}
      >
        <ChevronRight className="-m-1.5" />
        <ChevronRight className="-m-1.5 opacity-40" />
        <ChevronRight className="-m-1.5 opacity-20" />
      </div>
    </Link>
  );
}
