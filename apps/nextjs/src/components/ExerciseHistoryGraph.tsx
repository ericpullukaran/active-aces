import React, { useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

import { api } from "~/trpc/react";
import { GraphSkeleton } from "./active_workout/WorkoutExerciseSettingsDrawer";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
);

type Props = {
  exerciseId: string;
  workoutType: "reps" | "time-distance" | "weight-reps" | "time";
};

export default function ExerciseHistoryGraph({
  exerciseId,
  workoutType,
}: Props) {
  const [setOrder, setSetOrder] = useState(0);
  const { data, isLoading, isError } =
    api.workouts.getExerciseSetHistory.useQuery({
      exerciseId,
      setOrder,
    });

  if (isLoading) return <GraphSkeleton />;
  if (isError) return <p>Error fetching exercise data.</p>;

  const labels =
    data?.map((set) =>
      set.workoutDate ? new Date(set.workoutDate).toLocaleDateString() : "",
    ) ?? [];
  const datasets = [];

  switch (workoutType) {
    case "reps":
      datasets.push({
        label: "Reps",
        data: data?.map((set) => set.numReps),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      });
      break;
    case "time-distance":
      datasets.push(
        {
          label: "Time (s)",
          data: data?.map((set) => set.time),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Distance (m)",
          data: data?.map((set) => set.distance),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.5)",
        },
      );
      break;
    case "weight-reps":
      datasets.push(
        {
          label: "Weight (kg)",
          data: data?.map((set) => set.weight),
          borderColor: "rgb(255, 206, 86)",
          backgroundColor: "rgba(255, 206, 86, 0.5)",
        },
        {
          label: "Reps",
          data: data?.map((set) => set.numReps),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
        },
      );
      break;
    case "time":
      datasets.push({
        label: "Time (s)",
        data: data?.map((set) => set.time),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      });
      break;
  }

  const chartData = {
    labels,
    datasets,
  };

  return (
    <div>
      <div className="flex items-center">
        <h2 className="flex-1">Exercise History</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"sm"}>
              Set No. {setOrder + 1}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {Array.from({ length: 6 }, (_, i) => (
              <DropdownMenuItem key={i} onSelect={() => setSetOrder(i)}>
                Set {i + 1}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {workoutType === "time-distance" || workoutType === "weight-reps" ? (
        <Bar data={chartData} />
      ) : (
        <Line data={chartData} />
      )}
    </div>
  );
}
