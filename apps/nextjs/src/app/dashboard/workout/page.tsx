import React from "react";
import { Boxes, Settings, StopCircle, Tally5 } from "lucide-react";

import { Button } from "~/components/ui/button";
import WorkoutActionButtons from "~/components/WorkoutActionButtons";
import WorkoutStats from "~/components/WorkoutStats";

type Props = {};

export default function WorkoutPage({}: Props) {
  return (
    <div>
      <div className="m-5 mx-6 flex items-center">
        <StopCircle className="animate-pulse stroke-red-500" />
        <h1 className="ml-3 flex-1 text-4xl font-bold">Activity</h1>
        <Settings className="stroke-zinc-400" />
      </div>

      <div className="mx-5 flex h-24 overflow-x-scroll rounded-xl bg-card">
        <WorkoutStats />
      </div>

      <div className="fixed bottom-6 left-1/2 flex w-full max-w-3xl -translate-x-1/2 gap-2 px-4">
        <WorkoutActionButtons />
      </div>
    </div>
  );
}
