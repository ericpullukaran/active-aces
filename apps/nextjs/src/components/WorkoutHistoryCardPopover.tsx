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
    <Button
      variant={"outline"}
      size={"icon"}
      className="rounded-full"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <Popover>
        <PopoverTrigger>
          <CircleEllipsis />
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
    </Button>
  );
}
