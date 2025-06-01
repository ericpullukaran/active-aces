import React from "react"
import WorkoutExerciseWidget from "../WorkoutExerciseWidget"
import { AnimatePresence } from "motion/react"
import WorkoutStats from "../WorkoutStats"
import { TextShimmer } from "../ui/text-shimer"
import ArrowIcon from "../ui/ArrowIcon"
import { useWorkoutExercises } from "~/lib/utils/useWorkoutExercises"

export default function WorkoutScreen() {
  const { isLoading, exercises } = useWorkoutExercises()

  return (
    <div className="relative isolate">
      <WorkoutStats />
      <div className="isolate flex flex-col items-center gap-8 pt-10 pb-52">
        <AnimatePresence mode="popLayout">
          {isLoading && <TextShimmer className="text-center text-sm">Loading...</TextShimmer>}
          {!isLoading && exercises.length === 0 && (
            <div className="text-muted-foreground fixed bottom-30 flex w-full cursor-pointer items-start justify-center gap-2 rounded-3xl text-center text-sm">
              Add an exercise to get started!
              <ArrowIcon className="fill-muted-foreground h-16 pt-2" />
            </div>
          )}
          {exercises.map((exercise, exerciseIndex) => {
            return (
              <WorkoutExerciseWidget
                key={exercise.stableExerciseId}
                exercise={exercise}
                exerciseIndex={exerciseIndex}
              />
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
