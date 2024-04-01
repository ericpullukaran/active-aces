import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import { useUpdatedRef } from "./useUpdatedRef";
import { vibrate } from "./vibrate";

let audio: HTMLAudioElement;
const loadAudio = async () => {
  if (!audio) {
    audio = new Audio("/sounds/workout-timer-complete.mp3");
    await new Promise((resolve) => (audio.onloadeddata = resolve));
    audio.volume = 1;
  }
  return audio;
};
const _playWorkoutCompleteSound = async () => {
  const audio = await loadAudio();
  await audio.play();
};
const playWorkoutCompleteSound = () => {
  _playWorkoutCompleteSound().catch(console.error);
};

export const useWorkoutTimer = (
  durationSeconds?: number | undefined | null,
) => {
  const [endTime, setEndTime] = useState<Date | null>(null);
  const endTimeRef = useUpdatedRef(endTime);
  const isTimerRunning = !!endTime;

  useEffect(() => {
    loadAudio().catch(console.error);
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      if (dayjs().isAfter(endTimeRef.current)) {
        setEndTime(null);
        playWorkoutCompleteSound();
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
