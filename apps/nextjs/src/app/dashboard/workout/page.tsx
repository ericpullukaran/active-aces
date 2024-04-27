"use client";

import type { ComponentProps } from "react";
import React, { startTransition } from "react";
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
import { FormControl, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { WhenHydrated } from "~/components/WhenHydrated";
import WorkoutExerciseHeader from "~/components/WorkoutExerciseHeader";
import WorkoutSettingsDrawer from "~/components/WorkoutSettingsDrawer";
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

const getDefaultSet = () => ({
  tmpId: Math.random(),
  numReps: 0,
  weight: 0,
  time: 0,
  distance: 0,
  complete: false,
});

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
  const workoutTimer = useWorkoutTimer(workoutTimerDuration);

  const addExercise = (exerciseId: string) => {
    setWorkout({
      // TODO: remove the non-null assertion
      ...workout!,
      exercises: [
        ...(workout?.exercises ?? []),
        {
          exerciseId,
          sets: [getDefaultSet()],
          collapsed: false,
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
                sets: [...exercise.sets, getDefaultSet()],
              }
            : exercise,
        ) ?? [],
    });
  };

  const updateSet = (
    exerciseIndex: number,
    tmpId: number,
    setUpdate: Partial<
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
                sets: exercise.sets.map((s) => {
                  if (s.tmpId === tmpId) {
                    return {
                      numReps: 0,
                      weight: 0,
                      time: 0,
                      distance: 0,
                      complete: false,
                      ...s,
                      ...setUpdate,
                    };
                  } else {
                    return s;
                  }
                }),
              }
            : exercise,
        ) ?? [],
    });

    if (setUpdate.complete) {
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

  const cancelWorkout = () => {
    router.push("/dashboard");
    startTransition(() => {
      clearWorkout();
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
          cancelWorkout();
        },
      },
    );
  };

  const removeSet = (exerciseIndex: number, tmpId: number) => {
    const updatedExercises = workout?.exercises.map((exercise, idx) => {
      if (idx === exerciseIndex) {
        const updatedSets = exercise.sets.filter((set) => set.tmpId !== tmpId);
        return { ...exercise, sets: updatedSets };
      }
      return exercise;
    });

    if (updatedExercises) {
      setWorkout({ ...workout!, exercises: updatedExercises });
    }
  };

  const trailingActions = (exerciseIndex: number, tmpId: number) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => removeSet(exerciseIndex, tmpId)}
      >
        <div className="grid place-content-center rounded-r-lg bg-destructive pr-4">
          Delete
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  const collapseExercise = (exerciseIndex: number) => {
    setWorkout({
      ...workout!,
      exercises: workout!.exercises.map((e, idx) =>
        idx === exerciseIndex ? { ...e, collapsed: !e.collapsed } : e,
      ),
    });
  };

  return (
    <WhenHydrated>
      <div className="relative flex min-h-[100svh] flex-col px-4">
        <NavBar
          title={workout?.name ?? "Active Workout"}
          navigateBack="/dashboard"
          rightSideContent={
            <WorkoutSettingsDrawer
              workoutTimerDuration={workoutTimerDuration}
              setWorkoutTimerDuration={setWorkoutTimerDuration}
              cancelWorkout={cancelWorkout}
            />
          }
        />

        <WorkoutStats workout={workout} currentWorkout={workout} />

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
                console.log(exercise);

                return (
                  <div
                    key={exerciseIndex}
                    className="space-y-4 rounded-xl bg-card"
                  >
                    {exerciseDetails ? (
                      <>
                        <WorkoutExerciseHeader
                          index={exerciseIndex}
                          exercise={exerciseDetails}
                          currExercise={exercise}
                          deleteExercise={deleteExercise}
                          collapseExercise={collapseExercise}
                        />
                        {!exercise.collapsed && (
                          <div className="p-4 pt-0">
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
                            <SwipeableList destructiveCallbackDelay={100}>
                              {exercise.sets.map((set, setIndex) => (
                                <SwipeableListItem
                                  key={set.tmpId}
                                  trailingActions={trailingActions(
                                    exerciseIndex,
                                    set.tmpId,
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
                                          onFocus={(event) =>
                                            event.target.select()
                                          }
                                          {...measurementToDetails[measurement]
                                            .inputProps}
                                          placeholder={measurement}
                                          value={set[measurement]}
                                          onChange={(e) => {
                                            updateSet(
                                              exerciseIndex,
                                              set.tmpId,
                                              {
                                                [measurement]:
                                                  e.target.valueAsNumber,
                                                // complete: e.target.valueAsNumber
                                                //   ? true
                                                //   : false,
                                              },
                                            );
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
                                          updateSet(exerciseIndex, set.tmpId, {
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
                              <p className="text-center text-sm">
                                tf you doing?
                              </p>
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
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4">
                        <Skeleton className="h-8 w-28" />
                      </div>
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
            <EndWorkoutDrawer
              isLoading={putWorkoutRouter.isPending}
              onEnd={endWorkout}
              title={workout?.name}
            />
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
