import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, Settings, StopCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import WorkoutHistoryCard from "~/components/WorkoutHistoryCard";
import { api } from "~/trpc/server";

type Props = {};

export default async function HistoryPage({}: Props) {
  const workouts = await api.workouts.history({ limit: 10 });
  return (
    <div className="flex min-h-[100svh] flex-col p-5">
      <div className="mb-5 flex items-center px-1">
        <Button variant="outline" size="icon" asChild className="sq-8">
          <Link href={"/dashboard"}>
            <ArrowLeft className="sq-5" />
          </Link>
        </Button>
        <h1 className="ml-3 flex-1 text-3xl font-semibold">Recent Activity</h1>
        <Settings className="stroke-zinc-400" />
      </div>
      <div className="flex flex-col gap-4">
        {workouts.workouts.map((workout) => (
          <WorkoutHistoryCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}
