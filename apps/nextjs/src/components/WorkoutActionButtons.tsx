"use client";

import React from "react";
import { Button } from "@/components/ui/button";

import { api } from "~/trpc/react";
import ExercisesDrawer from "./ExercisesDrawer";

type Props = {};

export default function WorkoutActionButtons({}: Props) {
  // const endWorkout = api.workouts.delete
  return (
    <>
      <Button className="h-16 flex-1" variant={"destructive"}>
        End Workout
      </Button>
      <ExercisesDrawer />
    </>
  );
}
