import React from "react";
import { Trash } from "lucide-react";

import { RouterInputs, RouterOutputs } from "@acme/api";
import { DocInsert } from "@acme/db";

import { Button } from "./ui/button";

type Props = {
  index: number;
  exercise: RouterOutputs["exercises"]["all"][number];
  currExercise: RouterInputs["workouts"]["put"]["workout"]["exercises"][number];
  deleteExercise: (exerciseIndex: number) => void;
  collapseExercise: (exerciseIndex: number) => void;
};

export default function WorkoutExerciseHeader({
  index,
  exercise,
  currExercise,
  deleteExercise,
  collapseExercise,
}: Props) {
  const completedSets = currExercise.sets.reduce(
    (acc, s) => acc + (s.complete ? 1 : 0),
    0,
  );

  const handleDeleteClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    deleteExercise(index);
  };
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      collapseExercise(index);
      event.preventDefault();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => collapseExercise(index)}
      onKeyDown={handleKeyPress}
      className="ring-card-lighter flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-2xl ring-2"
    >
      <div>
        <p className="text-lg font-semibold">{exercise.name}</p>
        {currExercise.collapsed && (
          <p className="text-sm opacity-50">
            {completedSets}/{currExercise.sets.length} sets
          </p>
        )}
      </div>
      <Button
        size="icon-sm"
        variant="outline"
        className="border-destructive"
        onClick={handleDeleteClick}
      >
        <Trash size="1em" className="text-sm text-destructive-foreground" />
      </Button>
    </div>
  );
}
