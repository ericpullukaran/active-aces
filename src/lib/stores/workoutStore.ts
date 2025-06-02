import { proxy, subscribe } from "valtio"
import {
  type PutWorkout,
  type WorkoutExercise,
  type ExerciseSet,
  type WorkoutHistoryExercise,
} from "~/lib/types/workout"
import {
  defaultExerciseSet,
  defaultWorkout,
  defaultWorkoutExercise,
  isSetADefaultSet,
} from "../utils/defaults"
import { navigationActions } from "./navigationStore"
import SuperJSON from "superjson"
import { devtools } from "valtio/utils"
import { type Doc } from "../db"

const WORKOUT_STORAGE_KEY = "current_workout"
const loadWorkoutFromStorage = (): PutWorkout | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(WORKOUT_STORAGE_KEY)
    if (!stored) return null
    return SuperJSON.parse(stored) as PutWorkout
  } catch (error) {
    console.error("Error loading workout from localStorage:", error)
    return null
  }
}

const saveWorkoutToStorage = (workout: PutWorkout | null) => {
  if (typeof window === "undefined") return

  try {
    if (workout === null) {
      localStorage.removeItem(WORKOUT_STORAGE_KEY)
    } else {
      localStorage.setItem(WORKOUT_STORAGE_KEY, SuperJSON.stringify(workout))
    }
  } catch (error) {
    console.error("Error saving workout to localStorage:", error)
  }
}

export const workoutStore = proxy<{
  currentWorkout: PutWorkout | null
}>({
  currentWorkout: loadWorkoutFromStorage(),
})

subscribe(workoutStore, () => {
  saveWorkoutToStorage(workoutStore.currentWorkout)
})

if (process.env.NODE_ENV === "development") {
  devtools(workoutStore, { name: "workout-store" })
}

const findExercise = (stableExerciseId: string) => {
  if (!workoutStore.currentWorkout) return null
  return workoutStore.currentWorkout.exercises.find(
    (ex) => ex.stableExerciseId === stableExerciseId,
  )
}

export const workoutActions = {
  startWorkout: () => {
    workoutStore.currentWorkout = defaultWorkout()
  },
  removeCurrentWorkout: () => {
    workoutStore.currentWorkout = null
  },
  forceCopyWorkout: (workout: WorkoutHistoryExercise) => {
    workoutStore.currentWorkout = {
      ...defaultWorkout(),
      exercises: workout.workoutExercises.map((we) => ({
        ...defaultWorkoutExercise(we.exercise.id),
        ...we,
        // We dont prefill the notes
        notes: undefined,
        sets: we.sets.map((_) => ({
          // We dont prefill the set values
          ...defaultExerciseSet(),
          completed: false,
          completedAt: undefined,
        })),
      })),
    }
    navigationActions.setCurrentPage("workout")
  },
  maybeCopyWorkout: (workout: WorkoutHistoryExercise) => {
    if (workoutStore.currentWorkout) {
      return false
    } else {
      workoutActions.forceCopyWorkout(workout)
      return true
    }
  },

  updateWorkoutNotes: (notes: string) => {
    if (!workoutStore.currentWorkout) return
    workoutStore.currentWorkout.notes = notes
  },

  addExercise: (exercise: WorkoutExercise) => {
    if (!workoutStore.currentWorkout) return
    workoutStore.currentWorkout.exercises.push(exercise)
  },

  deleteExercise: (stableExerciseId: string) => {
    if (!workoutStore.currentWorkout) return
    workoutStore.currentWorkout.exercises = workoutStore.currentWorkout.exercises.filter(
      (ex) => ex.stableExerciseId !== stableExerciseId,
    )
  },

  updateExerciseAssistedReps: (stableExerciseId: string, enableAssistedReps: boolean) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.enableAssistedReps = enableAssistedReps
  },

  updateExerciseWeightedReps: (stableExerciseId: string, enableWeightedReps: boolean) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.enableWeightedReps = enableWeightedReps
  },

  updateExerciseNotes: (stableExerciseId: string, notes: string) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.notes = notes
  },

  updateExerciseRestTime: (stableExerciseId: string, restTimeSeconds: number | undefined) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.restTimeMs = restTimeSeconds ? restTimeSeconds * 1000 : undefined
  },

  addSet: (stableExerciseId: string) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.sets.push(defaultExerciseSet())
  },

  updateSet: (stableExerciseId: string, stableSetId: string, setUpdate: Partial<ExerciseSet>) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return

    const set = exercise.sets.find((s: ExerciseSet) => s.stableSetId === stableSetId)
    if (!set) return

    Object.assign(set, setUpdate)
  },

  prefillExerciseSets: (
    stableExerciseId: string,
    previousSetMetrics: (Doc<"exerciseSets"> | null)[],
  ) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return

    let enableAssistedReps = false
    let enableWeightedReps = false
    exercise.sets.forEach((set, index) => {
      const previousSet = previousSetMetrics[index]
      if (!previousSet) {
        return
      }
      // Only prefill sets that aren't completed and don't previous data
      if (isSetADefaultSet(set)) {
        Object.assign(set, extractPrefillableFields(previousSet))
      }
      if (previousSet.assistedReps && previousSet.assistedReps > 0) {
        enableAssistedReps = true
      }
      if (previousSet.weight && previousSet.weight > 0) {
        enableWeightedReps = true
      }
    })

    exercise.enableAssistedReps = enableAssistedReps
    exercise.enableWeightedReps = enableWeightedReps
  },

  removeSet: (stableExerciseId: string, stableSetId: string) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.sets = exercise.sets.filter((set) => set.stableSetId !== stableSetId)
  },
}

const extractPrefillableFields = (previousSet: Doc<"exerciseSets">): Partial<ExerciseSet> => {
  return {
    weight: previousSet.weight ?? undefined,
    reps: previousSet.reps ?? undefined,
    assistedReps: previousSet.assistedReps ?? undefined,
    distance: previousSet.distance ?? undefined,
    time: previousSet.time ?? undefined,
  } satisfies Omit<ExerciseSet, "stableSetId">
}
