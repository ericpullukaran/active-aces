import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { getWorkoutTimerTimeLeft } from "~/utils/dates";

export const Countdown = (props: {
  to: Date;
  children?: (formattedTimeLeft: string) => ReactNode;
}) => {
  const [formattedTimeLeft, setFormattedTimeLeft] = useState(() => {
    return getWorkoutTimerTimeLeft(props.to);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTimeLeft(getWorkoutTimerTimeLeft(props.to));
    }, 50);
    return () => clearInterval(interval);
  }, [props.to]);

  return props.children?.(formattedTimeLeft) ?? formattedTimeLeft;
};
