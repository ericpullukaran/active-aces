import React from "react";

import NavBar from "~/components/NavBar";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { api } from "~/trpc/server";

type Props = {};

export default async function DashboardPage({}: Props) {
  const currentWorkout = await api.workouts.getCurrent();

  return (
    <div className="w-full">
      <NavBar />
      <StartWorkoutButton workoutInProgress={!!currentWorkout} />
    </div>
  );
}
