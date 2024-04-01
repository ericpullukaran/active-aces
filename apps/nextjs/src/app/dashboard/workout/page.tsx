"use client";

import type { ComponentProps } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Check, PlusIcon, Settings, StopCircle, Trash } from "lucide-react";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";

import "react-swipeable-list/dist/styles.css";

import type { RouterInputs } from "@acme/api";
import type { Doc } from "@acme/db";

import { Countdown } from "~/components/Countdown";
import EndWorkoutDrawer from "~/components/EndWorkoutDrawer";
import ExercisesDrawer from "~/components/ExercisesDrawer";
import NavBar from "~/components/NavBar";
import { Button } from "~/components/ui/button";
import { WhenHydrated } from "~/components/WhenHydrated";
import WorkoutStats from "~/components/WorkoutStats";
import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { api } from "~/trpc/react";
import { useExercises } from "~/utils/use-search-exercises";
import { useLocalStorage } from "~/utils/useLocalStorage";
import { useWorkoutTimer } from "~/utils/useWorkoutTimer";

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
  const router = useRouter();
  const {
    currentWorkout: workout,
    setCurrentWorkout: setWorkout,
    clearWorkout,
  } = useCurrentWorkout();
  const exercises = useExercises();
  const putWorkoutRouter = api.workouts.put.useMutation();
  const exercisesById = Object.fromEntries(
    exercises.map((e) => [e.id, e]) ?? [],
  );
  const [workoutTimerDuration, setWorkoutTimerDuration] = useLocalStorage<
    number | null
  >("aa_workout-timer-duration", null);
  const workoutTimer = useWorkoutTimer(90);

  const addExercise = (exerciseId: string) => {
    setWorkout({
      // TODO: remove the non-null assertion
      ...workout!,
      exercises: [
        ...(workout?.exercises ?? []),
        {
          exerciseId,
          sets: [
            {
              numReps: 0,
              weight: 0,
              time: 0,
              distance: 0,
              complete: false,
            },
          ],
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

    if (set.complete) {
      workoutTimer.resetTimer();
    }
  };

  const deleteExercise = (exerciseIndex: number) => {
    setWorkout({
      ...workout!,
      exercises:
        workout?.exercises?.filter((_, i) => i !== exerciseIndex) ?? [],
    });
  };

  const endWorkout = (title: string, notes: string | undefined) => {
    putWorkoutRouter.mutate(
      {
        workout: {
          ...workout!,
          startTime: workout?.startTime ?? new Date(),
          endTime: new Date(),
          name: title,
          notes: notes,
        },
      },
      {
        onSuccess: () => {
          clearWorkout();
          router.push("/dashboard");
        },
      },
    );
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = workout?.exercises.map((exercise, idx) => {
      if (idx === exerciseIndex) {
        const updatedSets = exercise.sets.filter(
          (_, setIdx) => setIdx !== setIndex,
        );
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });
    if (updatedExercises) {
      setWorkout({ ...workout!, exercises: updatedExercises });
    }
  };

  const trailingActions = (exerciseIndex: number, setIndex: number) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => removeSet(exerciseIndex, setIndex)}
      >
        <div className="grid place-content-center rounded-r-lg bg-destructive pr-4">
          Delete
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <WhenHydrated>
      <div className="relative flex min-h-[100svh] flex-col px-4">
        <NavBar title="Active Workout" navigateBack="/dashboard" />

        <div className="mb-6 flex h-24 overflow-x-scroll rounded-xl ring-4 ring-card">
          <WorkoutStats workout={workout} currentWorkout={workout} />
        </div>

        <div
          className={cn("flex-1", {
            "pb-20": !workoutTimer.endTime,
            "pb-28": workoutTimer.endTime,
          })}
        >
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
                            variant="outline"
                            className="border-destructive"
                            onClick={() => deleteExercise(exerciseIndex)}
                          >
                            <Trash
                              size="1em"
                              className="text-sm text-destructive-foreground"
                            />
                          </Button>
                        </div>
                        <div
                          className="grid items-center gap-1 tabular-nums"
                          style={{
                            gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")} 3rem`,
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
                              className="mx-auto text-center text-sm font-semibold capitalize text-muted-foreground"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <SwipeableList>
                          {exercise.sets.map((set, setIndex) => (
                            <SwipeableListItem
                              key={setIndex}
                              trailingActions={trailingActions(
                                exerciseIndex,
                                setIndex,
                              )}
                            >
                              <div
                                className="grid w-full items-center gap-2 tabular-nums"
                                style={{
                                  gridTemplateColumns: `3rem ${Array.from(measurements, () => "1fr").join(" ")} 3rem`,
                                }}
                              >
                                <div className="text-center font-semibold">
                                  {setIndex + 1}
                                </div>
                                {measurements.map(
                                  (measurement, measurementIndex) => (
                                    <input
                                      key={measurement}
                                      type="number"
                                      inputMode="decimal"
                                      className="no-spin-buttonsrounded w-full rounded-md border-none bg-card p-2 text-center focus:ring-transparent"
                                      step={0.1}
                                      min={0}
                                      onFocus={(event) => event.target.select()}
                                      {...measurementToDetails[measurement]
                                        .inputProps}
                                      placeholder={measurement}
                                      value={set[measurement]}
                                      onChange={(e) => {
                                        updateSet(exerciseIndex, setIndex, {
                                          [measurement]: e.target.valueAsNumber,
                                          complete: e.target.valueAsNumber
                                            ? true
                                            : false,
                                        });
                                      }}
                                    />
                                  ),
                                )}
                                <div className="text-center">
                                  <input
                                    type="checkbox"
                                    className="h-6 w-10 rounded-full border-zinc-300 bg-transparent text-primary focus:ring-primary"
                                    checked={set.complete}
                                    onChange={(e) => {
                                      updateSet(exerciseIndex, setIndex, {
                                        complete: e.target.checked,
                                      });
                                    }}
                                  />
                                </div>
                              </div>
                            </SwipeableListItem>
                          ))}
                        </SwipeableList>

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
                        <p className="text-lg font-semibold">
                          Deleted exercise
                        </p>
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

        {workoutTimer.endTime?.toISOString() ?? "null"}

        <div className="fixed bottom-0 left-4 right-4 grid grid-cols-2 gap-4 bg-transparent py-4 backdrop-blur md:absolute">
          {workoutTimer.endTime ? (
            <div className="col-span-2 flex items-center gap-1">
              <Countdown to={workoutTimer.endTime}></Countdown>

              <div className="flex-1" />

              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => workoutTimer.addTime(-15)}
              >
                -15
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => workoutTimer.addTime(15)}
              >
                +15
              </Button>

              <Button
                size="icon"
                variant="ghost"
                onClick={workoutTimer.stopTimer}
              >
                <Settings size="1em" />
              </Button>
            </div>
          ) : null}

          {workout ? (
            <EndWorkoutDrawer onEnd={endWorkout} title={workout?.name} />
          ) : (
            <div className="w-full animate-pulse rounded-lg bg-zinc-500"></div>
          )}
          <ExercisesDrawer
            onExerciseSelect={(exerciseId) => {
              addExercise(exerciseId);
            }}
          />
        </div>
      </div>
    </WhenHydrated>
  );
}
