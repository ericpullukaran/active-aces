import React from "react";

import NavBar from "~/components/NavBar";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { WhenHydrated } from "~/components/WhenHydrated";

type Props = {};

export default async function DashboardPage({}: Props) {
  return (
    <div className="w-full">
      <NavBar />
      <WhenHydrated>
        <StartWorkoutButton />
      </WhenHydrated>
    </div>
  );
}
