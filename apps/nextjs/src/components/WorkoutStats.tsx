import React, { useEffect, useState } from "react";
import { Boxes, StopCircle, Tally5 } from "lucide-react";

import type { RouterInputs, RouterOutputs } from "@acme/api";

import { getUseableDuration } from "~/utils/getUseableDuration";

type Props = {
  workout: RouterInputs["workouts"]["put"]["workout"];
  currentWorkout: RouterOutputs["workouts"]["getCurrent"][number] | undefined;
};

export default function WorkoutStats({ workout, currentWorkout }: Props) {
  const [refresh, setRefresh] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(Date.now());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const duration = getUseableDuration(currentWorkout?.startTime);
  const workoutInfo = workout.exercises.reduce<{
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
    <>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1 text-sm">
          <StopCircle size="1em" />
          <div>Duration</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">{duration}</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1 text-sm">
          <Tally5 size="1em" />
          <div className="text-sm">Sets</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">
          {workoutInfo.totalSets}
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1 text-sm">
          <Boxes size="1em" />
          <div>Volume</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">
          {workoutInfo.volume}kgs
        </div>
      </div>
    </>
  );
}
