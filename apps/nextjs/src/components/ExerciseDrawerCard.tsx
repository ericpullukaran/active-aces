"use client";

import React from "react";

import type { Doc } from "@acme/db";

import { Badge } from "./ui/badge";
import { DrawerClose } from "./ui/drawer";

type Props = {
  exercise: Doc<"exercises">;
  onSelect: (exerciseId: string) => void;
};

export default function ExerciseDrawerCard({ exercise, onSelect }: Props) {
  return (
    <DrawerClose
      onClick={() => onSelect(exercise.id)}
      className="flex items-center space-x-4 rounded-md border p-4 text-left transition-all hover:border-primary"
    >
      <div className="h-10 w-10 rounded-lg bg-red-400"></div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <p className="flex-1 text-sm font-medium leading-none">
            {exercise.name}
          </p>
          <Badge className="px-2" variant={"outline"}>
            {exercise.primaryMuscleGroupId.substring(3)}
          </Badge>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {exercise.description}
        </p>
      </div>
    </DrawerClose>
  );
}
