"use client";

import React, { Suspense } from "react";

import NavBar from "~/components/NavBar";
import RecentWorkoutsCard from "~/components/RecentWorkoutsCard";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { getUsableWorkoutName } from "~/utils/getUseableWorkoutName";

type Props = {};

export default function DashboardPage({}: Props) {
  return (
    <div className="w-full">
      <NavBar title="Active Aces" />
      <div className="mx-4 pb-40">
        <h1 className="mb-10 mt-6 text-4xl font-semibold leading-10 tracking-tight text-white sm:text-6xl">
          Good {getUsableWorkoutName()}
          , Eric <br /> Welcome Back 👋
        </h1>
        <RecentWorkoutsCard />
        <div className="fixed bottom-0 left-0 right-0 grid h-20 place-content-center">
          <StartWorkoutButton />
        </div>
      </div>
    </div>
  );
}
