import React from "react";
import { MoreHorizontal, PlusSquare } from "lucide-react";
import { Flipped, Flipper } from "react-flip-toolkit";

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
import { api } from "~/trpc/react";
import { ONE_HOUR } from "~/utils/use-search-exercises";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Skeleton } from "./ui/skeleton";

type Props = {
  filters: string[];
  toggleFilter: (group: string) => void;
};

export default function ExercisesFilterDrawer({
  filters,
  toggleFilter,
}: Props) {
  const muscleGroups = api.exercises.getAllMuscleGroups.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: ONE_HOUR,
  });

  if (!muscleGroups.data) {
    return <Skeleton className="sq-9" />;
  }

  const selectedGroups = muscleGroups.data.filter((group) =>
    filters.includes(group.primaryMuscleGroup),
  );
  const unselectedGroups = muscleGroups.data.filter(
    (group) => !filters.includes(group.primaryMuscleGroup),
  );

  return (
    <Drawer>
      <DrawerTrigger className="p-1" asChild>
        <Button size="icon-sm" variant="ghost" id="exercises-filter-more">
          <PlusSquare className="text-zinc-600" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Select Muscle Groups</DrawerTitle>
          <DrawerDescription>
            Filter exercises by muscle groups
          </DrawerDescription>
        </DrawerHeader>
        <Flipper flipKey={filters.join(",")} className="overflow-y-scroll">
          <div className="mx-6 my-4 flex flex-col gap-3 px-2">
            {selectedGroups.length > 0 && (
              <div className="font-medium text-gray-300">Selected Filters</div>
            )}
            {selectedGroups.map((group) => (
              <Flipped
                key={group.primaryMuscleGroup}
                flipId={group.primaryMuscleGroup}
              >
                <Button
                  onClick={() => toggleFilter(group.primaryMuscleGroup)}
                  className="scale-105 rounded-lg bg-primary p-2 text-white shadow-lg"
                >
                  {group.primaryMuscleGroup.substring(3)}
                </Button>
              </Flipped>
            ))}
            {selectedGroups.length > 0 && <Separator className="my-4" />}

            {unselectedGroups.map((group) => (
              <Flipped
                key={group.primaryMuscleGroup}
                flipId={group.primaryMuscleGroup}
              >
                <Button
                  onClick={() => toggleFilter(group.primaryMuscleGroup)}
                  className="rounded-lg bg-card p-2 text-gray-300 shadow-lg hover:bg-gray-700"
                >
                  {group.primaryMuscleGroup.substring(3)}
                </Button>
              </Flipped>
            ))}
          </div>
        </Flipper>
      </DrawerContent>
    </Drawer>
  );
}
