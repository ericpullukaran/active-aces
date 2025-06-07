import React from "react"
import WorkoutExerciseWidget from "../WorkoutExerciseWidget"
import { AnimatePresence, Reorder, useDragControls } from "motion/react"
import WorkoutStats from "../WorkoutStats"
import { TextShimmer } from "../ui/text-shimer"
import ArrowIcon from "../ui/ArrowIcon"
import { useWorkoutExercises } from "~/lib/utils/useWorkoutExercises"
import { workoutActions } from "~/lib/stores/workoutStore"
import { type WorkoutExerciseWithMetadata } from "~/lib/types/workout"

function ReorderableExerciseItem({
  exercise,
  exerciseIndex,
}: {
  exercise: WorkoutExerciseWithMetadata
  exerciseIndex: number
}) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      key={exercise.stableExerciseId}
      value={exercise}
      className="flex justify-center"
      style={{
        position: "relative",
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 1000,
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 120,
      }}
      dragListener={false}
      dragControls={dragControls}
    >
      <WorkoutExerciseWidget
        exercise={exercise}
        exerciseIndex={exerciseIndex}
        dragControls={dragControls}
      />
    </Reorder.Item>
  )
}

export default function WorkoutScreen() {
  const { isLoading, exercises } = useWorkoutExercises()

  const handleReorder = (newOrder: typeof exercises) => {
    // Update the workout store with the new order
    workoutActions.reorderExercises(newOrder)
  }

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
          {!isLoading && exercises.length > 0 && (
            <Reorder.Group
              axis="y"
              values={exercises}
              onReorder={handleReorder}
              className="flex w-full flex-col items-center gap-8"
            >
              {exercises.map((exercise, exerciseIndex) => (
                <ReorderableExerciseItem
                  key={exercise.stableExerciseId}
                  exercise={exercise}
                  exerciseIndex={exerciseIndex}
                />
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
