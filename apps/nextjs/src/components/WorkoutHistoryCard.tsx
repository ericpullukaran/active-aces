"use client";

import React from "react";
import Link from "next/link";

import type { RouterOutputs } from "@acme/api";
import type { Doc } from "@acme/db";

import { api } from "~/trpc/react";
import { Badge } from "./ui/badge";
import WorkoutHistoryCardPopover from "./WorkoutHistoryCardPopover";

type Props = {
  workout: RouterOutputs["workouts"]["history"]["workouts"][number];
  internalNav?: boolean;
};

export default function WorkoutHistoryCard({ workout, internalNav }: Props) {
  return (
    <Link
      href={`/dashboard/history/${workout.id}${internalNav ? "?internalNav=true" : ""}`}
      className="flex items-center space-x-4 rounded-md border p-4 text-left transition-all hover:border-primary"
    >
      <div className="flex-1">
        <p className="mb-0.5 text-lg font-medium leading-none">
          {workout.name}
        </p>
        <p className="mb-2 text-sm text-zinc-400">
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
            timeZone: "Australia/Sydney",
          }).format(workout.startTime ?? undefined)}{" "}
          | {workout.exercises.length} exercise
          {workout.exercises.length !== 1 && "s"}
        </p>
        <div className="flex flex-wrap gap-2">
          {workout.categorySet.map((e) => (
            <Badge key={e} variant={"outline"}>
              {e}
            </Badge>
          ))}
        </div>
      </div>
      {!internalNav && <WorkoutHistoryCardPopover workoutId={workout.id} />}
    </Link>
  );
}
