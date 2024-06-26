"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import WorkoutHistoryCard from "./WorkoutHistoryCard";

type Props = {};

export default function RecentWorkoutsCard({}: Props) {
  const workoutHistory = api.workouts.history.useQuery({ limit: 3 });

  if (!workoutHistory.data) {
    return <div className="h-96 animate-pulse rounded-lg bg-card"></div>;
  }

  if (workoutHistory.data.workouts.length) {
    return (
      <div className="rounded-lg bg-card p-4">
        <div className="mb-3 flex items-center">
          <h3 className="flex-1 text-lg font-semibold">Recent Workouts</h3>
          <Button variant={"ghost"} className="bg-card" asChild>
            <Link href={"/dashboard/history"} className="flex text-right">
              See More
              <ArrowRight className="sq-5 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {workoutHistory.data?.workouts.map((w) => (
            <WorkoutHistoryCard key={w.id} workout={w} internalNav={true} />
          ))}
        </div>
      </div>
    );
  }
}
