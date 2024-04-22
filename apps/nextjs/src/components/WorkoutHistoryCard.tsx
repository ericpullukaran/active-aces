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
  const exercises = api.exercises.all.useQuery(undefined, {});

  if (!exercises.data) {
    return <></>;
  }

  const exercisesMapById = exercises.data.reduce<
    Record<string, Doc<"exercises">>
  >((acc, e) => {
    acc[e.id] = { ...e };
    return acc;
  }, {});

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
          {workout.exercises.map((e) => {
            return (
              <Badge key={e.exerciseId} variant={"outline"}>
                {exercisesMapById[e.exerciseId]?.name}
              </Badge>
            );
          })}
        </div>
      </div>
      {!internalNav && <WorkoutHistoryCardPopover workoutId={workout.id} />}
    </Link>
  );
}
