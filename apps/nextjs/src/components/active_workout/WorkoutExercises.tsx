import React from "react";

import type { RouterInputs } from "@acme/api";

import type { useWorkoutTimer } from "~/utils/useWorkoutTimer";
import { useExercises } from "~/utils/use-search-exercises";
import { Skeleton } from "../ui/skeleton";
import WorkoutExerciseBody from "./WorkoutExerciseBody";
import WorkoutExerciseHeader from "./WorkoutExerciseHeader";

type Props = {
  cachedWorkoutExercises: RouterInputs["workouts"]["put"]["workout"]["exercises"];
  workoutTimer: ReturnType<typeof useWorkoutTimer>;
};

export default function WorkoutExercises({
  cachedWorkoutExercises,
  workoutTimer,
}: Props) {
  const exercises = useExercises();
  const exercisesById = Object.fromEntries(
    exercises.map((e) => [e.id, e]) ?? [],
  );
  return (
    <div className="space-y-4">
      {cachedWorkoutExercises.map((exercise, exerciseIndex) => {
        const exerciseDetails = exercisesById[exercise.exerciseId];

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
  );
}
