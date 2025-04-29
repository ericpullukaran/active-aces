import { MeasurementMetric, MeasurementType } from "~/lib/db/types"
import { Doc } from "../db"

// Measurement field labels
export const MEASUREMENT_FIELDS = {
  weight: { label: "Weight" },
  reps: { label: "Reps" },
  assistedReps: { label: "Assisted" },
  time: { label: "Time" },
  distance: { label: "Distance" },
} satisfies Record<MeasurementMetric, { label: string }>

export const MeasurementTypeLabels = {
  [MeasurementType.REPS]: "Reps",
  [MeasurementType.WEIGHT_REPS]: "Weight & Reps",
  [MeasurementType.TIME_DISTANCE]: "Time & Distance",
  [MeasurementType.WEIGHT_DURATION]: "Weight & Duration",
  [MeasurementType.WEIGHT_DISTANCE]: "Weight & Distance",
  [MeasurementType.TIME]: "Time",
} satisfies Record<MeasurementType, string>

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
export function formatSetValue(set: Doc<"exerciseSets">, metric: MeasurementMetric): string {
  if (set[metric] == null) return "-"

  return set[metric].toString() || "-"
}
