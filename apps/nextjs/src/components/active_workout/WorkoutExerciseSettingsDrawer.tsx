import React, { useState } from "react";
import { MoreHorizontal, RotateCcw, Settings } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { useCurrentWorkout } from "~/lib/current-workout";
import { Button } from "../ui/button";
import { FormItem } from "../ui/form";

type Props = {
  exerciseIndex: number;
  onClose: () => void;
};

export default function WorkoutExerciseSettingsDrawer({
  exerciseIndex,
  onClose,
}: Props) {
  const { currentWorkout: workout, setCurrentWorkout: setWorkout } =
    useCurrentWorkout();

  const deleteExercise = (exerciseIndex: number) => {
    setWorkout({
      ...workout!,
      exercises:
        workout?.exercises?.filter((_, i) => i !== exerciseIndex) ?? [],
    });
  };

  return (
    <Drawer onClose={onClose}>
      <DrawerTrigger className="" asChild onClick={(e) => e.stopPropagation()}>
        <Button size="icon-sm" variant="ghost">
          <MoreHorizontal className="sq-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Exercise Settings</DrawerTitle>
        </DrawerHeader>
        <div className="mx-8 mb-4 flex flex-col gap-3">{/*  */}</div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteExercise(exerciseIndex)}
            >
              Delete Exercise
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
