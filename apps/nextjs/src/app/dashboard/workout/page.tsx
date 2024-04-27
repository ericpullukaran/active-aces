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

import EndWorkoutDrawer from "~/components/active_workout/EndWorkoutDrawer";
import WorkoutExerciseBody, {
  getDefaultSet,
} from "~/components/active_workout/WorkoutExerciseBody";
import WorkoutExerciseHeader from "~/components/active_workout/WorkoutExerciseHeader";
import WorkoutExerciseSetsInputs from "~/components/active_workout/WorkoutExerciseSetsInputs";
import WorkoutSettingsDrawer from "~/components/active_workout/WorkoutSettingsDrawer";
import WorkoutStats from "~/components/active_workout/WorkoutStats";
import { Countdown } from "~/components/Countdown";
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
import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { api } from "~/trpc/react";
import { useExercises } from "~/utils/use-search-exercises";
import { useLocalStorage } from "~/utils/useLocalStorage";
import { useWorkoutTimer } from "~/utils/useWorkoutTimer";

type Props = {};

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
                console.log(exercise);

                return (
                  <div key={exerciseIndex} className="rounded-xl bg-card">
                    {exerciseDetails ? (
                      <>
                        <WorkoutExerciseHeader
                          exerciseIndex={exerciseIndex}
                          currExercise={exercise}
                        />
                        {!exercise.collapsed && (
                          <WorkoutExerciseBody
                            exerciseIndex={exerciseIndex}
                            currExercise={exercise}
                            workoutTimer={workoutTimer}
                          />
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
