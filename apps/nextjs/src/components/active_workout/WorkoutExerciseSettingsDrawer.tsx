import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
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
import { useExercises } from "~/utils/use-search-exercises";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const ExerciseHistoryGraph = dynamic(() => import("../ExerciseHistoryGraph"));

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
  const exercises = useExercises();
  const exercisesById = Object.fromEntries(
    exercises.map((e) => [e.id, e]) ?? [],
  );

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
      <DrawerContent onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>Exercise Settings</DrawerTitle>
        </DrawerHeader>
        <div className="mx-8 mb-4 flex flex-col gap-3">
          <Suspense fallback={<GraphSkeleton />}>
            <ExerciseHistoryGraph
              workoutType="weight-reps"
              exerciseId={workout?.exercises[exerciseIndex]?.exerciseId ?? ""}
            />
          </Suspense>
        </div>
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

export const GraphSkeleton = () => <Skeleton className="h-36 w-full" />;
