"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, use, useCallback } from "react";

import type { RouterInputs } from "@acme/api";

import { getUsableWorkoutName } from "~/utils/getUseableWorkoutName";
import { useLocalStorage } from "~/utils/useLocalStorage";
import { useUpdatedRef } from "~/utils/useUpdatedRef";

export type CurrentWorkout = RouterInputs["workouts"]["put"]["workout"] | null;

const CurrentWorkoutContext = createContext<{
  currentWorkout: CurrentWorkout;
  setCurrentWorkout: Dispatch<SetStateAction<CurrentWorkout>>;
  clearWorkout: () => void;
  startWorkout: () => void;
} | null>(null);

export const CurrentWorkoutProvider = (props: { children: ReactNode }) => {
  const [currentWorkout, setCurrentWorkout, clearWorkout] =
    useLocalStorage<CurrentWorkout | null>("aa_workout", null);

  const currentWorkoutRef = useUpdatedRef(currentWorkout);

  const startWorkout = useCallback(() => {
    if (currentWorkoutRef.current) {
      throw new Error("Cannot start a workout since one is already running");
    }

    setCurrentWorkout({
      name: getUsableWorkoutName() + " Workout",
      startTime: new Date(),
      exercises: [],
    });
  }, [currentWorkoutRef, setCurrentWorkout]);

  return (
    <CurrentWorkoutContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
        clearWorkout,
        startWorkout,
      }}
    >
      {props.children}
    </CurrentWorkoutContext.Provider>
  );
};

export const useCurrentWorkout = () => {
  const ctx = use(CurrentWorkoutContext);

  if (!ctx) {
    throw new Error(
      "useCurrentWorkout must be used in child component of CurrentWorkoutProvider",
    );
  }

  return ctx;
};
