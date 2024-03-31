"use client";

import React from "react";
import { CircleEllipsis, Trash } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";

type Props = {
  workoutId: string;
};

export default function WorkoutHistoryCardPopover({ workoutId }: Props) {
  const deleteWorkout = api.workouts.delete.useMutation();
  return (
    <div
      className="sq-8 grid place-content-center rounded-full ring-2 ring-card transition-colors hover:bg-zinc-700"
      onClick={(e) => e.preventDefault()}
      onKeyDown={(e) => e.preventDefault()}
      role="button"
      tabIndex={-1}
    >
      <Popover>
        <PopoverTrigger>
          <CircleEllipsis className="sq-6" />
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-1 p-1">
          <Button variant={"ghost"} className="w-full">
            Edit
          </Button>
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => {
              deleteWorkout.mutate({ id: workoutId });
            }}
          >
            Delete
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
