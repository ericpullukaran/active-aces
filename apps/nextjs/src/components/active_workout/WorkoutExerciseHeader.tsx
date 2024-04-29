import React, { useCallback, useMemo } from "react";

import type { RouterInputs } from "@acme/api";

import { useCurrentWorkout } from "~/lib/current-workout";
import { useExercises } from "~/utils/use-search-exercises";
import AnimatedVisibility from "../AnimatedVisibility";
import { Skeleton } from "../ui/skeleton";
import WorkoutExerciseSettingsDrawer from "./WorkoutExerciseSettingsDrawer";

type Props = {
  exerciseIndex: number;
  currExercise: RouterInputs["workouts"]["put"]["workout"]["exercises"][number];
};

export default function WorkoutExerciseHeader({
  exerciseIndex,
  currExercise,
}: Props) {
  const { setCurrentWorkout } = useCurrentWorkout();
  const allExercises = useExercises();

  const specificExercise = useMemo(
    () => allExercises.find((e) => e.id === currExercise.exerciseId),
    [allExercises, currExercise.exerciseId],
  );

  const completedSets = useMemo(
    () =>
      currExercise.sets.reduce((acc, set) => acc + (set.complete ? 1 : 0), 0),
    [currExercise.sets],
  );

  const toggleCollapse = useCallback(() => {
    setCurrentWorkout((prevWorkout) => ({
      ...prevWorkout!,
      exercises: prevWorkout!.exercises.map((exercise, idx) =>
        idx === exerciseIndex
          ? { ...exercise, collapsed: !exercise.collapsed }
          : exercise,
      ),
    }));
  }, [setCurrentWorkout, exerciseIndex]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggleCollapse}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          toggleCollapse();
          event.preventDefault();
        }
      }}
      className="ring-card-lighter flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-2xl ring-2"
    >
      <div>
        <p className="text-lg font-semibold transition-all">
          <AnimatedVisibility
            isVisible={specificExercise?.name !== undefined}
            dependency={specificExercise}
            initalHeight={-1}
          >
            {specificExercise?.name}
          </AnimatedVisibility>
          {!specificExercise?.name && <Skeleton className="h-6 w-20" />}
        </p>
        {currExercise.collapsed && (
          <p className="text-sm opacity-50">
            {completedSets}/{currExercise.sets.length} sets
          </p>
        )}
      </div>
      <WorkoutExerciseSettingsDrawer
        exerciseIndex={exerciseIndex}
        onClose={toggleCollapse}
      />
    </div>
  );
}
