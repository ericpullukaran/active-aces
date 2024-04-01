import { useEffect, useState } from "react";

import { useUpdatedRef } from "./useUpdatedRef";

export const useIntervalValue = <T>(
  getValue: () => T,
  intervalMs: number | null = 50,
) => {
  const getValueRef = useUpdatedRef(getValue);
  const [value, setValue] = useState(getValueRef.current);

  useEffect(() => {
    if (intervalMs === null) return;

    const interval = setInterval(() => {
      setValue(getValueRef.current);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [getValueRef, intervalMs]);

  return value;
};
