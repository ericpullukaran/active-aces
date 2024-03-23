import React from "react";
import { ChevronRight, Play } from "lucide-react";

import NavBar from "~/components/NavBar";
import StartWorkoutButton from "~/components/StartWorkoutButton";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="w-full">
      <NavBar />
      <StartWorkoutButton workoutInProgress={false} />
    </div>
  );
}
