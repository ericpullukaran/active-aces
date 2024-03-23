import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import ExercisesDrawer from "./ExercisesDrawer";

type Props = {};

export default function WorkoutActionButtons({}: Props) {
  return (
    <>
      <Button className="h-16 flex-1" variant={"destructive"}>
        End Workout
      </Button>
      <ExercisesDrawer />
    </>
  );
}
