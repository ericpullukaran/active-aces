import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Settings, StopCircle } from "lucide-react";

import NavBar from "~/components/NavBar";
import { Button } from "~/components/ui/button";
import WorkoutHistoryCard from "~/components/WorkoutHistoryCard";
import { api } from "~/trpc/server";

type Props = {};

export default async function HistoryPage({}: Props) {
  const workouts = await api.workouts.history({ limit: 10 });
  return (
    <div className="flex min-h-[100svh] flex-col px-5">
      <NavBar title="Recent Workouts" navigateBack="/dashboard" />
      <div className="flex flex-col gap-4">
        {workouts.workouts.map((workout) => (
          <WorkoutHistoryCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
