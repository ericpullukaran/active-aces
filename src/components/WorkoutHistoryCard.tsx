"use client";

import React from "react";
import Link from "next/link";

import { Doc } from "~/lib/db";

type Props = {
  workout: Doc<"workouts">;
  internalNav?: boolean;
};

export default function WorkoutHistoryCard({ workout, internalNav }: Props) {
  return (
    <Link
      href={`/dashboard/history/${workout.id}${
        internalNav ? "?internalNav=true" : ""
      }`}
      className="flex items-center space-x-4 rounded-md border p-4 text-left transition-all hover:border-primary"
    >
      <div className="flex-1">
        <p className="mb-0.5 text-lg font-medium leading-none">
          {workout.name}
        </p>
      </div>
    </Link>
  );
}
