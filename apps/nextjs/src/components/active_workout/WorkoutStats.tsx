import React from "react";
import { Boxes, StopCircle, Tally5 } from "lucide-react";

import type { RouterInputs } from "@acme/api";

import { Duration } from "../Duration";

type Props = {
  workout: RouterInputs["workouts"]["put"]["workout"] | null;
  currentWorkout: RouterInputs["workouts"]["put"]["workout"] | null;
};

export default function WorkoutStats({ workout, currentWorkout }: Props) {
  const workoutInfo = workout?.exercises.reduce<{
    exercises: Set<string>;
    totalSets: number;
    volume: number;
  }>(
    (acc, e) => {
      acc.exercises.add(e.exerciseId);
      acc.totalSets += e.sets.reduce((acc, s) => acc + (s.complete ? 1 : 0), 0);
      acc.volume += e.sets.reduce((acc, s) => acc + (s.weight ?? 0), 0);
      return acc;
    },
    { exercises: new Set<string>(), totalSets: 0, volume: 0 },
  );
  return (
    <div className="mb-6 flex h-16 overflow-x-scroll rounded-xl ring-card">
      <div className="flex flex-1 flex-col items-center justify-center border-r-2 border-card">
        <div className="flex items-center gap-1 text-sm">
          <StopCircle size="1em" className="animate-pulse text-destructive" />
          <div>Duration</div>
        </div>
        <div className="text-xl font-medium tabular-nums">
          <Duration from={currentWorkout?.startTime}></Duration>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center border-r-2 border-card px-4">
        <div className="flex items-center gap-1 text-sm">
          <Tally5 size="1em" />
          <div className="text-sm">Sets</div>
        </div>
        <div className="text-xl font-medium tabular-nums">
          {workoutInfo?.totalSets}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1 text-sm">
          <Boxes size="1em" />
          <div>Volume</div>
        </div>
        <div className="text-xl font-medium tabular-nums">
          {workoutInfo?.volume}kgs
        </div>
      </div>
    </div>
  );
}
