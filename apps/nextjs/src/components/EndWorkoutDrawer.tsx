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
  isLoading: boolean;
  onEnd: (title: string, notes: string | undefined) => void;
  title: string | null | undefined;
};

export default function EndWorkoutDrawer({
  isLoading,
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
            <div className="block font-semibold">Workout Title</div>
            <Input
              id="workoutTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter workout title"
              className="mt-1 block w-full"
            />
          </div>

          <div className="">
            <div className="block font-semibold">Notes</div>
            <Input
              id="workoutNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              type="text"
              placeholder="Add any notes (optional)"
              className="mt-1 block w-full"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button isLoading={isLoading} onClick={handleSubmit}>
            Submit
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
