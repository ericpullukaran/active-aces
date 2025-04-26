export function WorkoutExerciseHeader({ collapseExercise }: { collapseExercise: () => void }) {
  return (
    <div
      onClick={collapseExercise}
      className="ring-card-lighter flex cursor-pointer items-center justify-between rounded-xl p-4 shadow-2xl ring-2"
    >
      I am in the header
    </div>
  )
}
