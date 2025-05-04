import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"

dayjs.extend(duration)

export { dayjs }

export const getDurationFrom = (startTime: Date | string | undefined | null) => {
  const currentTime = dayjs()
  const parsedStartTime = dayjs(startTime)

  const hoursDiff = currentTime.diff(parsedStartTime, "hours")
  const format = hoursDiff > 0 ? "HH:mm:ss" : "mm:ss"

  return dayjs.duration(currentTime.diff(parsedStartTime)).format(format)
}
