import type { ComponentProps } from "react";
import React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Settings } from "lucide-react";

import type { Doc } from "@acme/db";

import NavBar from "~/components/NavBar";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

type Props = {
  params: { workoutId: string };
};

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

export default async function SpecificWorkoutPage({ params }: Props) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const workout = await api.workouts.get({ id: params.workoutId });
  const exercises = await api.exercises.all();
  const exercisesById = Object.fromEntries(
    exercises.map((e) => [e.id, e]) ?? [],
  );
  return (
    <div className="flex min-h-[100svh] flex-col px-5">
      <NavBar title={workout?.name ?? ""} navigateBack="/dashboard/history" />
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
                  className="space-y-4 rounded-xl p-4 ring-2 ring-card"
                >
                  {exerciseDetails ? (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold">
                          {exerciseDetails.name}
                        </p>
                      </div>
                      <div
                        className="grid items-center gap-1 tabular-nums"
                        style={{
                          gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")}`,
                        }}
                      >
                        {[
                          "Set",
                          ...measurements.map(
                            (m) => measurementToDetails[m].label,
                          ),
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
                            gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")}`,
                          }}
                        >
                          <div className="text-center font-semibold">
                            {setIndex + 1}
                          </div>
                          {measurements.map((measurement, measurementIndex) => (
                            <div
                              key={measurement}
                              className="no-spin-buttons w-full rounded bg-card p-2 text-center"
                            >
                              {set[measurement]}
                            </div>
                          ))}
                        </div>
                      ))}

                      {exercise.sets.length >= 100 && (
                        <p className="text-center text-sm">tf you doing?</p>
                      )}
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
    </div>
  );
}
