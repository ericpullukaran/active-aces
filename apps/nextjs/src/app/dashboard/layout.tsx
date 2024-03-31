import React from "react";

import { CurrentWorkoutProvider } from "~/lib/current-workout";

export default function layout(props: { children: React.ReactNode }) {
  return (
    <CurrentWorkoutProvider>
      <div className="mx-auto w-full max-w-7xl">{props.children}</div>
    </CurrentWorkoutProvider>
  );
}
