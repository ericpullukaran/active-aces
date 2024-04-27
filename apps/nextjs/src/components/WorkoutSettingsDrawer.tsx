import React, { useState } from "react";
import { RotateCcw, Settings } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "./ui/button";
import { FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Props = {
  workoutTimerDuration: number | null;
  setWorkoutTimerDuration: (value: number | null) => void;
  cancelWorkout: () => void;
};

export default function WorkoutSettingsDrawer({
  workoutTimerDuration,
  setWorkoutTimerDuration,
  cancelWorkout,
}: Props) {
  return (
    <Drawer>
      <DrawerTrigger className="" asChild>
        <Button size="icon-sm" variant="ghost">
          <Settings className="sq-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workout Settings</DrawerTitle>
        </DrawerHeader>
        <div className="mx-8 mb-4 flex flex-col gap-3">
          <FormItem>
            <Label htmlFor="workout-rest-timer-duration">
              Rest timer duration (seconds)
            </Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="0"
                type="number"
                id="workout-rest-timer-duration"
                value={workoutTimerDuration ?? ""}
                onChange={(e) => {
                  setWorkoutTimerDuration(
                    Number.isNaN(e.target.valueAsNumber)
                      ? null
                      : e.target.valueAsNumber,
                  );
                }}
              />
              <Button
                variant={"outline"}
                onClick={() => setWorkoutTimerDuration(0)}
              >
                <RotateCcw />
              </Button>
            </div>
          </FormItem>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="destructive" size="sm" onClick={cancelWorkout}>
              Cancel workout
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
