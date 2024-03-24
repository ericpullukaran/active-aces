"use client";

import React from "react";

import { api } from "~/trpc/react";
import ExerciseDrawerCard from "./ExerciseDrawerCard";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

type Props = {
  onExerciseSelect: (exerciseId: string) => void;
};
export default function ExercisesDrawer(props: Props) {
  const exercises = api.exercises.all.useQuery();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="h-16 flex-1 border-dashed border-zinc-200 text-zinc-200"
          variant="outline"
        >
          Add Exercises
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Exercises</DrawerTitle>
          <DrawerDescription>
            Choose an exercise to add to your workout
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-scroll">
          <div className="mx-auto w-full max-w-sm ">
            <section className="mx-4 mb-10 flex flex-col gap-3">
              {exercises.data?.map((e) => (
                <ExerciseDrawerCard
                  key={e.id}
                  exercise={e}
                  onSelect={props.onExerciseSelect}
                />
              ))}
            </section>
            {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
