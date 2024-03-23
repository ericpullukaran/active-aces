import React from "react";
import { Boxes, StopCircle, Tally5 } from "lucide-react";

type Props = {};

export default function WorkoutStats({}: Props) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1">
          <StopCircle className="h-4 w-4" />
          <div>Duration</div>
        </div>
        <div className="text-4xl font-semibold">35:34</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1">
          <Tally5 className="h-4 w-4" />
          <div>Sets</div>
        </div>
        <div className="text-4xl font-semibold">10</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1">
          <Boxes className="h-4 w-4" />
          <div>Volume</div>
        </div>
        <div className="text-4xl font-semibold">1520kg</div>
      </div>
    </>
  );
}
