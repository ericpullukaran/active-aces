import React from "react";
import { Boxes, StopCircle, Tally5 } from "lucide-react";

type Props = {};

export default function WorkoutStats({}: Props) {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1 text-sm">
          <StopCircle size="1em" />
          <div>Duration</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">35:34</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center border-r-[2px] border-zinc-700">
        <div className="flex items-center gap-1 text-sm">
          <Tally5 size="1em" />
          <div className="text-sm">Sets</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">10</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1 text-sm">
          <Boxes size="1em" />
          <div>Volume</div>
        </div>
        <div className="text-3xl font-medium tabular-nums">1520kg</div>
      </div>
    </>
  );
}
