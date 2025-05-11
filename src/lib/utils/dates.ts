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

/**
 * Format time value in seconds to MM:SS or HH:MM:SS format
 */
export const formatTimeValue = (timeInSeconds: number): string => {
  if (!timeInSeconds) return ""

  const duration = dayjs.duration(timeInSeconds, "seconds")
  return timeInSeconds >= 3600 ? duration.format("HH:mm:ss") : duration.format("mm:ss")
}

/**
 * Parse valid or invalid time string (MM:SS or HH:MM:SS) to seconds
 * By invalid, I mean hours/minutes/seconds can be >60
 */
export const parseTimeToSeconds = (timeString: string): number => {
  if (!timeString) return 0

  const parts = timeString.split(":").map((part) => parseInt(part, 10))

  if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 1 && !isNaN(parts[0])) {
    // Just seconds
    return parts[0]
  }

  return 0
}

/**
 * Returns a time-appropriate workout name based on the current hour.
 */
export const getTimeOfDay = () => {
  const hours = new Date().getHours()
  let timeOfDay

  if (hours >= 5 && hours < 12) {
    timeOfDay = "Morning"
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = "Afternoon"
  } else if (hours >= 18 && hours < 22) {
    timeOfDay = "Evening"
  } else if (hours >= 22 || hours < 5) {
    timeOfDay = "Night"
  }

  return timeOfDay
}
