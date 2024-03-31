"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, use, useEffect } from "react";

import type { RouterInputs } from "@acme/api";

import { useLocalStorage } from "~/utils/useLocalStorage";

type CurrentWorkout = RouterInputs["workouts"]["put"]["workout"] | null;

const CurrentWorkoutContext = createContext<{
  currentWorkout: CurrentWorkout;
  setCurrentWorkout: Dispatch<SetStateAction<CurrentWorkout>>;
  clearWorkout: () => void;
} | null>(null);

export const CurrentWorkoutProvider = (props: { children: ReactNode }) => {
  const [currentWorkout, setCurrentWorkout, clearWorkout] =
    useLocalStorage<CurrentWorkout | null>("aa_workout", null);

  useEffect(() => {
    if (currentWorkout && !currentWorkout.startTime) {
      setCurrentWorkout({
        ...currentWorkout,
        startTime: new Date(),
      });
    }
  }, [currentWorkout, setCurrentWorkout]);

  return (
    <CurrentWorkoutContext.Provider
      value={{
        currentWorkout,
        setCurrentWorkout,
        clearWorkout,
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
