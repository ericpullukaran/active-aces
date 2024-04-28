import type { ComponentProps } from "react";
import React, { useCallback, useEffect, useMemo } from "react";
import { Check, Loader2, PlusIcon } from "lucide-react";

import type { RouterInputs } from "@acme/api";
import type { Doc } from "@acme/db";

import type { useWorkoutTimer } from "~/utils/useWorkoutTimer";
import { useCurrentWorkout } from "~/lib/current-workout";
import { api } from "~/trpc/react";
import { useExercises } from "~/utils/use-search-exercises";
import { Button } from "../ui/button";
import WorkoutExerciseSetsInputs from "./WorkoutExerciseSetsInputs";

export type SetMeasurement = Exclude<
  keyof Doc<"workoutExerciseSets">,
  "id" | "complete" | "order" | "workoutExerciseId"
>;

export const exerciseTypeToFields: Record<
  Doc<"exercises">["measurementType"],
  SetMeasurement[]
> = {
  reps: ["numReps"],
  "time-distance": ["time", "distance"],
  "weight-reps": ["weight", "numReps"],
  time: ["time"],
};

export const measurementToDetails: Record<
  SetMeasurement,
  { label: string; inputProps?: ComponentProps<"input"> }
> = {
  distance: {
    label: "Distance",
  },
  numReps: {
    label: "Reps",
    inputProps: {
      min: 0,
      step: 1,
    },
  },
  time: {
    label: "Time",
  },
  weight: {
    label: "Weight",
  },
};

export const getDefaultSet = () => ({
  tmpId: Math.random(),
  numReps: 0,
  weight: 0,
  time: 0,
  distance: 0,
  complete: false,
});

type Props = {
  exerciseIndex: number;
  currExercise: RouterInputs["workouts"]["put"]["workout"]["exercises"][number];
  workoutTimer: ReturnType<typeof useWorkoutTimer>;
};

export default function WorkoutExerciseBody({
  workoutTimer,
  exerciseIndex,
  currExercise,
}: Props) {
  const { currentWorkout, setCurrentWorkout, clearWorkout } =
    useCurrentWorkout();
  const allExercises = useExercises();
  const getPreviousSet = api.workouts.getPreviousSet.useMutation();

  const addSet = useCallback(async () => {
    const newSet = {
      ...getDefaultSet(),
      order: currExercise.sets.length,
    };

    const updatedExercises = currentWorkout!.exercises.map((exercise, idx) =>
      idx === exerciseIndex
        ? { ...exercise, sets: [...exercise.sets, newSet] }
        : exercise,
    );

    setCurrentWorkout({
      ...currentWorkout!,
      exercises: updatedExercises,
    });

    getPreviousSet.mutate(
      {
        exerciseId: currExercise.exerciseId,
        setOrder: newSet.order,
      },
      {
        onSuccess: (data) => {
          if (data) {
            const updatedSets = updatedExercises[exerciseIndex]?.sets.map(
              (set, idx) =>
                idx === newSet.order
                  ? { ...set, ...data, complete: false }
                  : set,
            );

            setCurrentWorkout((current) => ({
              ...current!,
              exercises: current!.exercises.map((ex, idx) =>
                idx === exerciseIndex ? { ...ex, sets: updatedSets ?? [] } : ex,
              ),
            }));
          }
        },
        onError: (error) => {
          console.error("Error fetching previous set details:", error);
        },
      },
    );
  }, [
    currExercise.sets.length,
    currExercise.exerciseId,
    currentWorkout,
    setCurrentWorkout,
    getPreviousSet,
    exerciseIndex,
  ]);

  const specificExercise = useMemo(
    () => allExercises.find((e) => e.id === currExercise.exerciseId),
    [allExercises, currExercise.exerciseId],
  );
  const measurements = useMemo(
    () => exerciseTypeToFields[specificExercise?.measurementType ?? "reps"],
    [specificExercise],
  );

  useEffect(() => {
    if (currExercise.sets.length === 0) {
      void addSet();
    }
  }, [addSet, currExercise.sets.length, currentWorkout]);

  return (
    <div className="p-4 pt-0">
      <div
        className="grid items-center gap-1 py-2 tabular-nums"
        style={{
          gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")} 3rem`,
        }}
      >
        {[
          "Set",
          ...measurements.map((m) => measurementToDetails[m].label),
          <Check key="check" size="1em" />,
        ].map((label, i) => (
          <span
            key={i}
            className="mx-auto text-center text-sm font-semibold capitalize text-muted-foreground"
          >
            {label}
          </span>
        ))}
      </div>

      <WorkoutExerciseSetsInputs
        isFetchingSetValue={getPreviousSet.isPending}
        exerciseIndex={exerciseIndex}
        currExercise={currExercise}
        measurements={measurements}
        workoutTimer={workoutTimer}
      />

      {currExercise.sets.length >= 100 && (
        <p className="text-center text-sm">tf you doing?</p>
      )}

      <Button
        size="sm"
        variant="outline"
        className="mt-2 w-full gap-1"
        onClick={() => addSet()}
      >
        <PlusIcon size="1em" className="text-sm" />
        Add set
      </Button>
    </div>
  );
}
