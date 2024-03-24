"use client";

import React from "react";

import type { Doc } from "@acme/db";

import { DrawerClose } from "./ui/drawer";

type Props = {
  exercise: Doc<"exercises">;
};

export default function ExerciseDrawerCard({ exercise }: Props) {
  return (
    <DrawerClose
      onClick={() => console.log(exercise.id)}
      className="flex items-center space-x-4 rounded-md border p-4 text-left transition-all hover:border-primary"
    >
      <div className="h-10 w-10 rounded-lg bg-red-400"></div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">{exercise.description}</p>
      </div>
    </DrawerClose>
  );
}
