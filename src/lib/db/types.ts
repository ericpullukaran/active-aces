export type MeasurementMetric = "weight" | "reps" | "assistedReps" | "time" | "distance"
export const enum MeasurementType {
  // e.g. Bench Press 100kg x 10reps
  WEIGHT_REPS = "weight-reps",

  // e.g. Run 100m in 10s
  TIME_DISTANCE = "time-distance",

  // e.g. Weighted plank 10kg x 10s
  WEIGHT_DURATION = "weight-duration",

  // e.g. Farmer carry 10kg x 10m
  WEIGHT_DISTANCE = "weight-distance",

  // e.g. Plank 1min
  TIME = "time",

  // e.g. Push-ups 50reps
  REPS = "reps",
}

// export enum MuscleGroup {
//   Abdominals = "Abdominals", // Abs
//   Abductors = "Abductors", // Hip Abductors / Outer Thigh
//   Adductors = "Adductors", // Hip Adductors / Inner Thigh
//   Biceps = "Biceps",
//   Calves = "Calves",
//   Cardio = "Cardio", // For cardiovascular exercises
//   Chest = "Chest", // Pectorals
//   Forearms = "Forearms",
//   Glutes = "Glutes",
//   Hamstrings = "Hamstrings",
//   HipFlexors = "HipFlexors", // Hip Flexors
//   Lats = "Lats", // Latissimus Dorsi
//   LowerBack = "LowerBack", // Erector Spinae
//   Neck = "Neck",
//   Obliques = "Obliques",
//   Quadriceps = "Quadriceps", // Quads
//   Rhomboids = "Rhomboids", // Mid/Upper Back
//   RotatorCuff = "RotatorCuff", // Shoulder Stabilizers
//   Shoulders = "Shoulders", // Deltoids
//   Shins = "Shins", // Tibialis Anterior
//   Traps = "Traps", // Trapezius
//   Triceps = "Triceps",
// }
