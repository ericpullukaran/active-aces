import { RouterOutputs } from "@acme/api";

export const getFallbackWorkoutName = () => {
  const hours = new Date().getHours();

  let timeBasedPart = "Untitled Workout";
  if (hours >= 2 && hours < 6) {
    timeBasedPart = "Early morning workout";
  } else if (hours >= 6 && hours < 12) {
    timeBasedPart = "Morning workout";
  } else if (hours >= 12 && hours < 17) {
    timeBasedPart = "Afternoon workout";
  } else if (hours > 17 && hours < 21) {
    timeBasedPart = "Evening workout";
  } else if (hours >= 21 || hours < 2) {
    timeBasedPart = "Late night workout";
  }

  return timeBasedPart;
};

export type Workout = RouterOutputs["workouts"]["history"]["workouts"][number];
export type Set = Workout["exercises"][number]["sets"][number];
export const getWorkoutVolume = (workout: Pick<Workout, "exercises">) => {
  return workout.exercises.reduce((acc, e) => {
    return e.sets.reduce((accSets, s) => {
      if (!s || !s.complete) return 0;
      const weight = "weight" in s ? s.weight : 0;
      const numReps = "numReps" in s ? s.numReps : 0;

      return accSets + weight * numReps;
    }, acc);
  }, 0);
};
