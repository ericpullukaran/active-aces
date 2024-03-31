import React from "react";

import NavBar from "~/components/NavBar";
import RecentWorkoutsCard from "~/components/RecentWorkoutsCard";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { WhenHydrated } from "~/components/WhenHydrated";
import { getUsableWorkoutName } from "~/utils/getUseableWorkoutName";

type Props = {};

export default async function DashboardPage({}: Props) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div className="w-full">
      <NavBar title="Active Aces" />
      <WhenHydrated>
        <div className="pb-40">
          <h1 className="mx-4 mb-10 mt-6 text-4xl font-bold leading-10 tracking-tight text-white sm:text-6xl">
            Good {getUsableWorkoutName()}, Eric <br /> Welcome Back 👋
          </h1>
          <RecentWorkoutsCard />
          <div className="fixed bottom-0 left-0 right-0 grid h-20 place-content-center bg-gradient-to-t from-primary/40">
            <StartWorkoutButton />
          </div>
        </div>
      </WhenHydrated>
    </div>
  );
}
