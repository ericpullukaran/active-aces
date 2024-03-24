"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, Play } from "lucide-react";

import { cn } from "~/lib/cn";
import { api } from "~/trpc/react";
import { getUsableWorkoutName } from "~/utils/getUseableWorkoutName";

type Props = { workoutInProgress: boolean };

export default function StartWorkoutButton({
  workoutInProgress = false,
}: Props) {
  const router = useRouter();
  const mutate = api.workouts.put.useMutation();

  return (
    <button
      onClick={() => {
        if (workoutInProgress) {
          router.push("/dashboard/workout");
          return;
        }
        mutate.mutate(
          {
            workout: {
              name: getUsableWorkoutName(),
              exercises: [],
              startTime: new Date(),
            },
          },
          { onSuccess: () => router.push("/dashboard/workout") },
        );
      }}
      className={cn(
        "absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center rounded-xl bg-card p-2 ring-primary transition-all hover:ring-2",
        { "w-64": !mutate.isPending },
      )}
    >
      <div
        className={cn(
          "grid h-11 w-11 place-content-center rounded-xl bg-primary pr-0.5",
          {
            "border-2 border-primary bg-transparent": workoutInProgress,
          },
        )}
      >
        {mutate.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin stroke-card" />
        ) : (
          <Play
            className={cn("h-5 w-5 fill-card stroke-card", {
              "fill-white stroke-white": workoutInProgress,
            })}
          />
        )}
      </div>
      <div
        className={cn("ml-3 flex-1 font-semibold transition-all", {
          hidden: mutate.isPending,
        })}
      >
        {workoutInProgress ? <>Continue</> : <>Start workout</>}
      </div>
      <div
        className={cn("mr-2 flex transition-all", {
          hidden: mutate.isPending,
        })}
      >
        <ChevronRight className="-m-1.5" />
        <ChevronRight className="-m-1.5 opacity-40" />
        <ChevronRight className="-m-1.5 opacity-20" />
      </div>
    </button>
  );
}
