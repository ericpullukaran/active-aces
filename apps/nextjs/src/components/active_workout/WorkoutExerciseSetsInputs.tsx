import React, { useCallback } from "react";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";

import type { RouterInputs } from "@acme/api";

import type { SetMeasurement } from "./WorkoutExerciseBody";
import type { useWorkoutTimer } from "~/utils/useWorkoutTimer";
import { cn } from "~/lib/cn";
import { useCurrentWorkout } from "~/lib/current-workout";
import { measurementToDetails } from "./WorkoutExerciseBody";

type Props = {
  exerciseIndex: number;
  measurements: SetMeasurement[];
  currExercise: RouterInputs["workouts"]["put"]["workout"]["exercises"][number];
  workoutTimer: ReturnType<typeof useWorkoutTimer>;
};

export default function WorkoutExerciseSetsInputs({
  exerciseIndex,
  measurements,
  currExercise,
  workoutTimer,
}: Props) {
  const { setCurrentWorkout } = useCurrentWorkout();

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
            className={cn(
              "grid w-full items-center gap-2 tabular-nums transition-colors",
              {
                "bg-green-950": set.complete,
              },
              {
                "rounded-t-lg":
                  setIndex === 0 || !currExercise.sets[setIndex - 1]?.complete,
                "rounded-b-lg":
                  currExercise.sets.length - 1 === setIndex ||
                  !currExercise.sets[setIndex + 1]?.complete,
                "bg-green-950": set.complete,
              },
            )}
            style={{
              gridTemplateColumns: `3rem ${measurements.map(() => "1fr").join(" ")} 3rem`,
            }}
          >
            <div className={cn("text-center font-semibold")}>
              {setIndex + 1}
            </div>
            {measurements.map((measurement) => (
              <input
                key={measurement}
                type="number"
                inputMode="decimal"
                className={cn(
                  "no-spin-buttonsrounded w-full rounded-md border-none bg-transparent p-2 text-center focus:ring-transparent",
                )}
                step={0.5}
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
                className="h-6 w-10 rounded-full border-zinc-300 bg-transparent text-primary focus:ring-green-800"
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
