"use client";

import type { ComponentProps } from "react";
import React, { HTMLInputTypeAttribute } from "react";
import { Check, Delete, PlusIcon, Settings, StopCircle } from "lucide-react";

import type { RouterInputs } from "@acme/api";
import type { Doc } from "@acme/db";

import ExercisesDrawer from "~/components/ExercisesDrawer";
import { Button } from "~/components/ui/button";
import WorkoutStats from "~/components/WorkoutStats";
import { api } from "~/trpc/react";
import { useLocalStorage } from "~/utils/useLocalStorage";

type Props = {};

type SetMeasurement = Exclude<
  keyof Doc<"workoutExerciseSets">,
  "id" | "complete" | "order" | "workoutExerciseId"
>;
const exerciseTypeToFields: Record<
  Doc<"exercises">["measurementType"],
  SetMeasurement[]
> = {
  reps: ["numReps"],
  "time-distance": ["time", "distance"],
  "weight-reps": ["weight", "numReps"],
  time: ["time"],
};

const measurementToDetails: Record<
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

export default function WorkoutPage({}: Props) {
  const [workout, setWorkout] = useLocalStorage<
    RouterInputs["workouts"]["put"]["workout"] | null
  >("aa_workout", null);
  const exercises = api.exercises.all.useQuery();
  const exercisesById = Object.fromEntries(
    exercises.data?.map((e) => [e.id, e]) ?? [],
  );

  const addExercise = (exerciseId: string) => {
    setWorkout({
      // TODO: remove the non-null assertion
      ...workout!,
      exercises: [
        ...(workout?.exercises ?? []),
        {
          exerciseId,
          sets: [],
        },
      ],
    });
  };

  const addSet = (exerciseIndex: number) => {
    setWorkout({
      ...workout!,
      exercises:
        workout?.exercises?.map((exercise, i) =>
          i === exerciseIndex
            ? {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  {
                    numReps: 0,
                    weight: 0,
                    time: 0,
                    distance: 0,
                    complete: false,
                  },
                ],
              }
            : exercise,
        ) ?? [],
    });
  };

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    set: Partial<
      RouterInputs["workouts"]["put"]["workout"]["exercises"][number]["sets"][number]
    >,
  ) => {
    setWorkout({
      ...workout!,
      exercises:
        workout?.exercises?.map((exercise, i) =>
          i === exerciseIndex
            ? {
                ...exercise,
                sets: [
                  ...exercise.sets.slice(0, setIndex),
                  {
                    numReps: 0,
                    weight: 0,
                    time: 0,
                    distance: 0,
                    complete: false,
                    ...exercise.sets[setIndex],
                    ...set,
                  },
                  ...exercise.sets.slice(setIndex + 1),
                ],
              }
            : exercise,
        ) ?? [],
    });
  };

  const deleteExercise = (exerciseIndex: number) => {
    setWorkout({
      ...workout!,
      exercises:
        workout?.exercises?.filter((_, i) => i !== exerciseIndex) ?? [],
    });
  };

  return (
    <div className="flex min-h-[100svh] flex-col p-5">
      <div className="mb-5 flex items-center px-1">
        <StopCircle className="animate-pulse stroke-red-500" />
        <h1 className="ml-3 flex-1 text-4xl font-medium">Activity</h1>
        <Settings className="stroke-zinc-400" />
      </div>

      <div className="mb-6 flex h-24 overflow-x-scroll rounded-xl bg-card">
        <WorkoutStats />
      </div>

      <div className="flex-1">
        {workout?.exercises?.length ? (
          <div className="space-y-4">
            {workout.exercises.map((exercise, exerciseIndex) => {
              const exerciseDetails = exercisesById[exercise.exerciseId];
              const measurements =
                exerciseTypeToFields[
                  exerciseDetails?.measurementType ?? "reps"
                ];
              return (
                <div
                  key={exerciseIndex}
                  className="space-y-4 rounded-xl bg-card p-4"
                >
                  {exerciseDetails ? (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">
                          {exerciseDetails.name}
                        </p>

                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => deleteExercise(exerciseIndex)}
                        >
                          <Delete size="1em" className="text-sm" />
                        </Button>
                      </div>
                      <div
                        className="grid items-center gap-1 tabular-nums"
                        style={{
                          gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")} 2rem`,
                        }}
                      >
                        {[
                          "Set",
                          ...measurements.map(
                            (m) => measurementToDetails[m].label,
                          ),
                          <Check key="check" size="1em" />,
                        ].map((label, i) => (
                          <span
                            key={i}
                            className="text-center text-sm font-semibold capitalize text-muted-foreground"
                          >
                            {label}
                          </span>
                        ))}
                      </div>

                      {exercise.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="grid items-center gap-2 tabular-nums"
                          style={{
                            gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")} 2rem`,
                          }}
                        >
                          <div className="text-center font-semibold">
                            {setIndex + 1}
                          </div>
                          {measurements.map((measurement, measurementIndex) => (
                            <input
                              key={measurement}
                              type="number"
                              className="no-spin-buttons w-full rounded bg-card p-2 text-center"
                              step={0.1}
                              min={0}
                              {...measurementToDetails[measurement].inputProps}
                              placeholder={measurement}
                              value={set[measurement]}
                              onChange={(e) =>
                                updateSet(exerciseIndex, setIndex, {
                                  [measurement]: e.target.valueAsNumber,
                                })
                              }
                            />
                          ))}
                          <div>
                            <input
                              type="checkbox"
                              checked={set.complete}
                              onChange={(e) => {
                                updateSet(exerciseIndex, setIndex, {
                                  complete: e.target.checked,
                                });
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      {exercise.sets.length >= 100 && (
                        <p className="text-center text-sm">tf you doing?</p>
                      )}

                      <Button
                        size="sm"
                        variant="secondary"
                        className="w-full gap-1"
                        // disabled={exercise.sets.length >= 100}
                        onClick={() => addSet(exerciseIndex)}
                      >
                        <PlusIcon size="1em" className="text-sm" />
                        Add set
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-semibold">Deleted exercise</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="flex h-36 items-center justify-center">
              <div className="text-sm text-muted-foreground">
                No exercises added
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 grid w-full grid-cols-2 gap-4 bg-transparent py-4 backdrop-blur">
        <Button variant="destructive">End Workout</Button>
        <ExercisesDrawer
          onExerciseSelect={(exerciseId) => {
            addExercise(exerciseId);
          }}
        />
      </div>
    </div>
  );
}
