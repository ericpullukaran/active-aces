import React from "react";

import NavBar from "~/components/NavBar";
import RecentWorkoutsCard from "~/components/RecentWorkoutsCard";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { WhenHydrated } from "~/components/WhenHydrated";
import { getUsableWorkoutName } from "~/utils/getUseableWorkoutName";

type Props = {};

export default async function DashboardPage({}: Props) {
  return (
    <div className="w-full">
      <NavBar title="Active Aces" />
      <WhenHydrated>
        <h1 className="mx-4 mb-10 mt-6 text-4xl font-bold leading-10 tracking-tight text-white sm:text-6xl">
          Good {getUsableWorkoutName()}, Eric <br /> Welcome Back 👋
        </h1>
        <RecentWorkoutsCard />
        <StartWorkoutButton />
      </WhenHydrated>
    </div>
  );
}
