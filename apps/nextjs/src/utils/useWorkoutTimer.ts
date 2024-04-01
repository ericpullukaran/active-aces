import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import { useUpdatedRef } from "./useUpdatedRef";
import { vibrate } from "./vibrate";

export const useWorkoutTimer = (
  durationSeconds?: number | undefined | null,
) => {
  const [endTime, setEndTime] = useState<Date | null>(null);
  const endTimeRef = useUpdatedRef(endTime);
  const isTimerRunning = !!endTime;

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      if (dayjs().isAfter(endTimeRef.current)) {
        setEndTime(null);
        vibrate([100, 50, 100, 50, 200]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning, endTimeRef]);

  const addTime = useCallback((timeSeconds: number) => {
    setEndTime((prev) => {
      if (!prev) return prev;
      return dayjs(prev).startOf("second").add(timeSeconds, "seconds").toDate();
    });
  }, []);

  const resetTimer = useCallback(() => {
    console.log({ durationSeconds });
    if (!durationSeconds) return;
    setEndTime(dayjs().add(durationSeconds, "seconds").toDate());
  }, [durationSeconds]);

  const stopTimer = useCallback(() => {
    setEndTime(null);
  }, []);

  return {
    resetTimer,
    addTime,
    stopTimer,
    endTime,
  };
};
