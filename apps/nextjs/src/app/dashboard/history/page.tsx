"use client";

import React from "react";

import NavBar from "~/components/NavBar";
import WorkoutHistoryCard from "~/components/WorkoutHistoryCard";
import { api } from "~/trpc/react";
import HistoryLoading from "./_loading";

type Props = {};

export default function HistoryPage({}: Props) {
  const workoutHistory = api.workouts.history.useQuery({ limit: 10 });

  if (!workoutHistory.data) {
    return <HistoryLoading />;
  }

  return (
    <div className="flex min-h-[100svh] flex-col px-5 pb-16">
      <NavBar title="Recent Workouts" navigateBack="/dashboard" />
      <div className="flex flex-col gap-4">
        {workoutHistory.data.workouts.map((workout) => (
          <WorkoutHistoryCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
