import React from "react";
import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

type Props = { workoutInProgress: boolean };

export default function StartWorkoutButton({
  workoutInProgress = false,
}: Props) {
  return (
    <Link
      href={"/dashboard/workout"}
      className="absolute bottom-12 left-1/2 flex w-64 -translate-x-1/2 items-center rounded-xl bg-card p-2 ring-primary transition-all hover:ring-2"
    >
      <div className="grid h-11 w-11 place-content-center rounded-xl bg-primary pr-0.5">
        <Play className="h-5 w-5 fill-card stroke-card" />
      </div>
      <div className="ml-3 flex-1 font-semibold">Start workout</div>
      <div className="mr-2 flex">
        <ChevronRight className="-m-1.5" />
        <ChevronRight className="-m-1.5 opacity-40" />
        <ChevronRight className="-m-1.5 opacity-20" />
      </div>
    </Link>
  );
}
