import { subscribeKey } from "valtio/utils"
import { useSyncExternalStore } from "react"
import { workoutStore } from "../stores/workoutStore"

export const useIsWorkoutActive = () => {
  return useSyncExternalStore(
    (callback) => subscribeKey(workoutStore, "currentWorkout", callback),
    () => workoutStore.currentWorkout !== null,
  )
}
