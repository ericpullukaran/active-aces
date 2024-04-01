"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

import { useExercises } from "~/utils/use-search-exercises";
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
import { Input } from "./ui/input";

type Props = {
  onExerciseSelect: (exerciseId: string) => void;
};
export default function ExercisesDrawer(props: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const exercises = useExercises(searchQuery);

  return (
    <Drawer onClose={() => setSearchQuery("")}>
      <DrawerTrigger asChild>
        <Button
          className="gap-1 border-dashed border-zinc-200 text-zinc-200"
          variant="outline"
        >
          <Plus size="1em" />
          Add Exercises
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader className="mx-auto w-full max-w-sm">
          <DrawerTitle>Exercises</DrawerTitle>
          <DrawerDescription>
            Choose an exercise to add to your workout
          </DrawerDescription>
          <div>
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercises..."
            />
          </div>
        </DrawerHeader>
        <div className="overflow-y-scroll" data-vaul-no-drag>
          <div className="mx-auto w-full max-w-sm ">
            <section className="mx-4 mb-10 flex flex-col gap-3">
              {exercises.map((e) => (
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
