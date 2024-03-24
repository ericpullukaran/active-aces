"use client";

import React from "react";

import type { RouterInputs } from "@acme/api";
import { Doc } from "@acme/db";

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

type Props = {};
export default function ExercisesDrawer({}: Props) {
  const {
    isPending,
    isError,
    data: exercises,
    error,
  } = api.exercises.all.useQuery();

  let aa: RouterInputs["workouts"]["put"]["workout"];
  // console.log(exercises);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="h-16 flex-1 border-dashed border-zinc-200 text-zinc-200"
          variant={"outline"}
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
        <div className="mx-auto w-full max-w-sm overflow-y-scroll">
          <section className="mx-4 mb-10 flex flex-col gap-3">
            {exercises?.map((e) => (
              <ExerciseDrawerCard key={e.id} exercise={e} />
            ))}
          </section>
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
