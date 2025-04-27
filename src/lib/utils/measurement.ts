import { MeasurementMetric, MeasurementType } from "~/lib/db/types"

// Measurement field labels
export const MEASUREMENT_FIELDS = {
  weight: { label: "Weight" },
  reps: { label: "Reps" },
  assistedReps: { label: "Assisted" },
  time: { label: "Time" },
  distance: { label: "Distance" },
} satisfies Record<MeasurementMetric, { label: string }>

/**
 * Gets the field keys for a given measurement type and assisted reps setting
 */
export function getFieldKeys(
  measurementType: MeasurementType,
  opts: {
    enableAssistedReps?: boolean
    enableWeightedReps?: boolean
  },
): MeasurementMetric[] {
  switch (measurementType) {
    case MeasurementType.WEIGHT_REPS:
      return ["weight", "reps", ...(opts.enableAssistedReps ? ["assistedReps" as const] : [])]
    case MeasurementType.TIME_DISTANCE:
      return ["time", "distance"]
    case MeasurementType.WEIGHT_DURATION:
      return ["weight", "time"]
    case MeasurementType.WEIGHT_DISTANCE:
      return ["weight", "distance"]
    case MeasurementType.TIME:
      return ["time"]
    case MeasurementType.REPS:
      return ["reps", ...(opts.enableWeightedReps ? ["weight" as const] : [])]
    default:
      return []
  }
}

/**
 * Format set value for display
 */
export function formatSetValue(set: any, metric: MeasurementMetric): string {
  if (set[metric] == null) return "-"

  if (metric === "time" && set.time != null) {
    // Format time in seconds or minutes:seconds
    const timeInSeconds = Math.floor(set.time / 1000)
    if (timeInSeconds < 60) return `${timeInSeconds}s`
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return set[metric]?.toString() || "-"
}
