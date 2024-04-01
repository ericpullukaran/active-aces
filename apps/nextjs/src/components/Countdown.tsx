import type { ReactNode } from "react";

import { getWorkoutTimerTimeLeft } from "~/utils/dates";
import { useIntervalValue } from "~/utils/useIntervalValue";

export const Countdown = (props: {
  to: Date;
  children?: (formattedTimeLeft: string) => ReactNode;
}) => {
  const formattedTimeLeft = useIntervalValue(
    () => getWorkoutTimerTimeLeft(props.to),
    50,
  );

  return props.children?.(formattedTimeLeft) ?? formattedTimeLeft;
};
