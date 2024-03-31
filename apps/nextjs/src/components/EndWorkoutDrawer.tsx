import React, { useState } from "react";

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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = {
  onEnd: (title: string, notes: string | undefined) => void;
  title: string | null | undefined;
};

export default function EndWorkoutDrawer({
  onEnd,
  title: initialTitle,
}: Props) {
  const [title, setTitle] = useState(initialTitle ?? "");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    onEnd(title, notes === "" ? undefined : notes);
  };

  return (
    <Drawer>
      <DrawerTrigger className="" asChild>
        <Button variant="destructive" className="w-full">
          End Workout
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finished?</DrawerTitle>
          <DrawerDescription>
            You are about to end the workout.
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-8 mb-4 flex flex-col gap-3">
          <div>
            <label
              htmlFor="workoutTitle"
              className="text-md block font-semibold"
            >
              Workout Title
            </label>
            <Input
              id="workoutTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter workout title"
              className="mt-1 block w-full focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="">
            <label
              htmlFor="workoutNotes"
              className="text-md block font-semibold"
            >
              Notes
            </label>
            <Textarea
              id="workoutNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes (optional)"
              className="mt-1 block w-full focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit}>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
