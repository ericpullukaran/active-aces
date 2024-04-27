import React, { useCallback } from "react";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";

import type { RouterInputs } from "@acme/api";

import type { SetMeasurement } from "./WorkoutExerciseBody";
import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { useLocalStorage } from "~/utils/useLocalStorage";
import { useWorkoutTimer } from "~/utils/useWorkoutTimer";
import { measurementToDetails } from "./WorkoutExerciseBody";

type Props = {
  exerciseIndex: number;
  measurements: SetMeasurement[];
  currExercise: RouterInputs["workouts"]["put"]["workout"]["exercises"][number];
};

export default function WorkoutExerciseSetsInputs({
  exerciseIndex,
  measurements,
  currExercise,
}: Props) {
  const { setCurrentWorkout } = useCurrentWorkout();
  const [workoutTimerDuration] = useLocalStorage<number | null>(
    "aa_workout-timer-duration",
    null,
  );
  const workoutTimer = useWorkoutTimer(workoutTimerDuration);

  const updateSet = useCallback(
    (
      tmpId: number,
      setUpdate: Partial<
        RouterInputs["workouts"]["put"]["workout"]["exercises"][number]["sets"][number]
      >,
    ) => {
      setCurrentWorkout((prev) => ({
        ...prev!,
        exercises: prev!.exercises.map((exercise, idx) =>
          idx === exerciseIndex
            ? {
                ...exercise,
                sets: exercise.sets.map((set) =>
                  set.tmpId === tmpId ? { ...set, ...setUpdate } : set,
                ),
              }
            : exercise,
        ),
      }));
      if (setUpdate.complete) {
        workoutTimer.resetTimer();
      }
    },
    [setCurrentWorkout, exerciseIndex, workoutTimer],
  );

  const removeSet = useCallback(
    (tmpId: number) => {
      setCurrentWorkout((prev) => ({
        ...prev!,
        exercises: prev!.exercises.map((exercise, idx) =>
          idx === exerciseIndex
            ? {
                ...exercise,
                sets: exercise.sets.filter((set) => set.tmpId !== tmpId),
              }
            : exercise,
        ),
      }));
    },
    [setCurrentWorkout, exerciseIndex],
  );

  const trailingActions = useCallback(
    (tmpId: number) => (
      <TrailingActions>
        <SwipeAction destructive={true} onClick={() => removeSet(tmpId)}>
          <div className="grid place-content-center rounded-r-lg bg-destructive pr-4">
            Delete
          </div>
        </SwipeAction>
      </TrailingActions>
    ),
    [removeSet],
  );

  return (
    <SwipeableList destructiveCallbackDelay={100}>
      {currExercise.sets.map((set, setIndex) => (
        <SwipeableListItem
          key={set.tmpId}
          trailingActions={trailingActions(set.tmpId)}
        >
          <div
            className="grid w-full items-center gap-2 tabular-nums"
            style={{
              gridTemplateColumns: `3rem ${measurements.map(() => "1fr").join(" ")} 3rem`,
            }}
          >
            <div
              className={cn("text-center font-semibold", {
                "text-zinc-600": set.complete,
              })}
            >
              {setIndex + 1}
            </div>
            {measurements.map((measurement) => (
              <input
                key={measurement}
                type="number"
                inputMode="decimal"
                className={cn(
                  "no-spin-buttonsrounded w-full rounded-md border-none bg-card p-2 text-center focus:ring-transparent",
                  {
                    "text-zinc-600": set.complete,
                  },
                )}
                step={0.1}
                min={0}
                onFocus={(event) => event.target.select()}
                {...measurementToDetails[measurement].inputProps}
                placeholder={measurement}
                value={set[measurement]}
                onChange={(e) =>
                  updateSet(set.tmpId, {
                    [measurement]: e.target.valueAsNumber,
                  })
                }
              />
            ))}
            <div className="text-center">
              <input
                type="checkbox"
                className="h-6 w-10 rounded-full border-zinc-300 bg-transparent text-primary focus:ring-primary"
                checked={set.complete}
                onChange={(e) =>
                  updateSet(set.tmpId, { complete: e.target.checked })
                }
              />
            </div>
          </div>
        </SwipeableListItem>
      ))}
    </SwipeableList>
  );
}
