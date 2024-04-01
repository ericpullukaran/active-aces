import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const getWorkoutTimerTimeLeft = (to: Date) => {
  const now = dayjs();
  const diffMS = dayjs(to).diff(now, "ms");
  const diffSeconds = Math.ceil(diffMS / 1000);
  return dayjs.duration(diffSeconds, "seconds").format("mm:ss");
};
