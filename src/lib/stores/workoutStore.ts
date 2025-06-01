import { proxy, subscribe } from "valtio"
import {
  type PutWorkout,
  type WorkoutExercise,
  type ExerciseSet,
  type WorkoutHistoryExercise,
} from "~/lib/types/workout"
import {
  aDefaultExerciseSetWith,
  defaultExerciseSet,
  defaultWorkout,
  defaultWorkoutExercise,
} from "../utils/defaults"
import { navigationActions } from "./navigationStore"
import SuperJSON from "superjson"
import { devtools } from "valtio/utils"

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
        notes: we.notes ?? undefined,
        sets: we.sets.map((set) => ({
          ...aDefaultExerciseSetWith(set),
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

    // Directly mutate the set properties
    Object.assign(set, setUpdate)
  },

  removeSet: (stableExerciseId: string, stableSetId: string) => {
    const exercise = findExercise(stableExerciseId)
    if (!exercise) return
    exercise.sets = exercise.sets.filter((set) => set.stableSetId !== stableSetId)
  },
}
