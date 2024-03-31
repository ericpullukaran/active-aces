import React from "react";

import NavBar from "~/components/NavBar";
import StartWorkoutButton from "~/components/StartWorkoutButton";
import { Badge } from "~/components/ui/badge";

type Props = {};

export default function DashboardLoading({}: Props) {
  return (
    <div className="flex flex-col px-5 pb-16">
      <NavBar title="Active Aces" />
      <div className="pb-40">
        <h1 className="mx-4 mb-10 mt-6 text-4xl font-bold leading-10 tracking-tight text-white sm:text-6xl">
          Good{" "}
          <span className="inline-block h-12 w-36 animate-pulse rounded-lg bg-card"></span>
          , Eric <br /> Welcome Back 👋
        </h1>
        <div className="h-96 animate-pulse rounded-lg bg-card"></div>
        <div className="fixed bottom-0 left-0 right-0 grid h-20 place-content-center bg-gradient-to-t from-primary/40">
          <div className="h-11 w-48 animate-pulse rounded-lg bg-card"></div>
        </div>
      </div>
    </div>
  );
}
