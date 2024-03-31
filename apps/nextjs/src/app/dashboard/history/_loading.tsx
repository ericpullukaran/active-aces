import React from "react";

import NavBar from "~/components/NavBar";
import { Badge } from "~/components/ui/badge";

type Props = {};

export default function HistoryLoading({}: Props) {
  return (
    <div className="flex flex-col px-5 pb-16">
      <NavBar title="Recent Workouts" navigateBack="/dashboard" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((workout) => (
          <div
            key={workout}
            className="h-28 w-full animate-pulse rounded-md border p-4"
          >
            <div className="flex-1">
              <div className="mb-1 h-5 w-24 animate-pulse rounded-lg bg-card"></div>
              <div className="mb-2 h-5 w-44 animate-pulse rounded-lg bg-card"></div>
              <div className="flex flex-wrap gap-2">
                <Badge className="animate-pulse bg-card">
                  <p className="text-card">......</p>
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
