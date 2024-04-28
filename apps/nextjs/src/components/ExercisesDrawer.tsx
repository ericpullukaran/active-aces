"use client";

import React, { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";

import { useExercises } from "~/utils/use-search-exercises";
import ExerciseDrawerCard from "./ExerciseDrawerCard";
import ExercisesFilterDrawer from "./ExercisesFilterDrawer";
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
import { Label } from "./ui/label";

type Props = {
  onExerciseSelect: (exerciseId: string) => void;
};
export default function ExercisesDrawer(props: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);
  const exercises = useExercises(searchQuery, filters);

  const toggleFilter = useCallback(
    (group: string) => {
      setFilters(
        filters.includes(group)
          ? filters.filter((f) => f !== group)
          : [...filters, group],
      );
    },
    [filters, setFilters],
  );

  return (
    <Drawer
      onClose={() => {
        setSearchQuery("");
        setFilters([]);
      }}
    >
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
        <div className="mx-4 mb-3">
          <div className="flex items-center">
            <Label className="flex-1" htmlFor="exercises-filter-more">
              <h2 className="font-semibold text-zinc-400">Filters</h2>
            </Label>
            <ExercisesFilterDrawer
              filters={filters}
              toggleFilter={toggleFilter}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                variant={"outline"}
                onClick={() => toggleFilter(f)}
                className="inline-flex items-center gap-1 rounded-full bg-background text-foreground/60"
                size={"xs"}
              >
                <p>{f.substring(3)}</p>
                <X className="sq-3" />
              </Button>
            ))}
          </div>
        </div>
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
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
