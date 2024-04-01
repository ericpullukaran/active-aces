import type { ReactNode } from "react";

import { getDurationFrom } from "~/utils/dates";
import { useIntervalValue } from "~/utils/useIntervalValue";

export const Duration = (props: {
  from: Date | string | null | undefined;
  children?: (formattedTimeLeft: string) => ReactNode;
}) => {
  const formattedTimeLeft = useIntervalValue(
    () => getDurationFrom(props.from),
    50,
  );

  return props.children?.(formattedTimeLeft) ?? formattedTimeLeft;
};
