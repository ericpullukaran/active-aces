import React from "react";

import NavBar from "~/components/NavBar";
import { Badge } from "~/components/ui/badge";

type Props = {};

export default function SpecificHistoryLoading({}: Props) {
  return (
    <div className="flex flex-col px-5 pb-16">
      <NavBar title="Workout" navigateBack="/dashboard" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((workout) => (
          <div
            key={workout}
            className="h-52 w-full animate-pulse rounded-xl border p-4"
          >
            <div className="flex-1">
              <div className="mb-1 h-7 w-24 animate-pulse rounded-lg bg-card"></div>
              <div className="mt-4 flex w-full justify-center">
                <div className="flex flex-1 justify-center">
                  <div className="mb-2 h-5 w-12 animate-pulse rounded-lg bg-card"></div>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="mb-2 h-5 w-12 animate-pulse rounded-lg bg-card"></div>
                </div>
                <div className="flex flex-1 justify-center">
                  <div className="mb-2 h-5 w-12 animate-pulse rounded-lg bg-card"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-7 animate-pulse rounded-lg bg-card"></div>
                <div className="h-7 animate-pulse rounded-lg bg-card"></div>
                <div className="h-7 animate-pulse rounded-lg bg-card"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
