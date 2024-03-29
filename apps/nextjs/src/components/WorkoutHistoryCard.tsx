import React from "react";
import Link from "next/link";

import type { Doc } from "@acme/db";
import { RouterOutputs } from "@acme/api";

import { api } from "~/trpc/server";
import { Badge } from "./ui/badge";

type Props = {
  workout: RouterOutputs["workouts"]["history"]["workouts"][number];
};

export default async function WorkoutHistoryCard({ workout }: Props) {
  const workoutInfo = workout.exercises.reduce<{
    exercises: Set<string>;
    totalSets: number;
  }>(
    (acc, e) => {
      acc.exercises.add(e.exerciseId);
      acc.totalSets += e.sets.reduce((acc, s) => acc + (s.complete ? 1 : 0), 0);
      return acc;
    },
    { exercises: new Set<string>(), totalSets: 0 },
  );
  const exercisesMapById = (await api.exercises.all()).reduce<
    Record<string, Doc<"exercises">>
  >((acc, e) => {
    acc[e.id] = { ...e };
    return acc;
  }, {});

  return (
    <Link
      href={"/dashboard/history/" + workout.id}
      className="flex items-center space-x-4 rounded-md border p-4 text-left transition-all hover:border-primary"
    >
      <div className="h-10 w-10 rounded-lg bg-red-400"></div>
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
    </Link>
  );
}
