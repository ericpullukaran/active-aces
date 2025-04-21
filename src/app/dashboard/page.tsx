"use client";

import React from "react";
import { useSession } from "@clerk/nextjs";
import NavBar from "~/components/NavBar";
import RecentWorkoutsCard from "~/components/RecentWorkoutsCard";

export default function DashboardPage() {
  const { session } = useSession();

  return (
    <div className="w-full">
      <NavBar title="Active Aces" />
      <div className="mx-4 pb-40">
        <h1 className="mb-10 mt-4 text-4xl font-semibold leading-10 tracking-tight text-white sm:text-6xl">
          Good morning, {session?.publicUserData.firstName} <br /> Welcome Back
          👋
        </h1>
        <RecentWorkoutsCard />
        {/* <div className="fixed bottom-0 left-0 right-0 grid h-20 place-content-center">
          <StartWorkoutButton />
        </div> */}
      </div>
    </div>
  );
}
