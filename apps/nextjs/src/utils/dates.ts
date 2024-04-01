import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export const getWorkoutTimerTimeLeft = (to: Date) => {
  const now = dayjs();
  const diff = dayjs(to).diff(now);
  return dayjs.duration(diff).format("mm:ss");
};
