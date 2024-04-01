import React from "react";

import NavBar from "~/components/NavBar";
import WorkoutHistoryCard from "~/components/WorkoutHistoryCard";
import { api } from "~/trpc/server";

type Props = {};

export default async function HistoryPage({}: Props) {
  const workoutHistory = await api.workouts.history({ limit: 10 });
  return (
    <div className="flex min-h-[100svh] flex-col px-5 pb-16">
      <NavBar title="Recent Workouts" navigateBack="/dashboard" />
      <div className="flex flex-col gap-4">
        {workoutHistory.workouts.map((workout) => (
          <WorkoutHistoryCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
