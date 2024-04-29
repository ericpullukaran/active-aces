import React from "react";

import type { RouterInputs } from "@acme/api";

import type { useWorkoutTimer } from "~/utils/useWorkoutTimer";
import { useCurrentWorkout } from "~/lib/current-workout";
import AnimatedVisibility from "../AnimatedVisibility";
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
  const { currentWorkout } = useCurrentWorkout();
  return (
    <div className="space-y-4">
      {cachedWorkoutExercises.map((exercise, exerciseIndex) => (
        <div key={exerciseIndex} className="rounded-xl bg-card">
          <WorkoutExerciseHeader
            exerciseIndex={exerciseIndex}
            currExercise={exercise}
          />
          <AnimatedVisibility
            isVisible={!exercise.collapsed}
            dependency={currentWorkout}
            initalHeight={0}
            initalWidth={100}
          >
            <WorkoutExerciseBody
              exerciseIndex={exerciseIndex}
              currExercise={exercise}
              workoutTimer={workoutTimer}
            />
          </AnimatedVisibility>
        </div>
      ))}
    </div>
  );
}
