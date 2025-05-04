import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { Stopwatch } from "./Stopwatch"
import { StopCircle, Tally5, Boxes } from "lucide-react"

export default function WorkoutStats() {
  const { currentWorkout } = useWorkoutManager()

  const workoutInfo = currentWorkout?.exercises.reduce(
    (acc, exercise) => {
      const exerciseSetsCount = exercise.sets.length
      const exerciseVolume = exercise.sets.reduce(
        (setAcc, set) => setAcc + (set.weight || 0) * (set.reps || 0),
        0,
      )

      return {
        totalSets: acc.totalSets + exerciseSetsCount,
        volume: acc.volume + exerciseVolume,
      }
    },
    { totalSets: 0, volume: 0 },
  )

  return (
    <div className="bg-card/70 sticky top-5 z-10 mb-4 flex w-full overflow-x-scroll rounded-3xl py-5 ring-4 ring-zinc-800/70 brightness-90 backdrop-blur-3xl">
      <div className="border-card flex flex-1 flex-col items-center justify-center border-r-2">
        <div className="flex items-center gap-1 text-sm">
          <StopCircle size="1em" className="text-destructive animate-pulse" />
          <div>Duration</div>
        </div>
        <div className="text-xl font-medium tabular-nums">
          <Stopwatch from={currentWorkout?.startTime}></Stopwatch>
        </div>
      </div>
      <div className="border-card flex flex-col items-center justify-center border-r-2 px-4">
        <div className="flex items-center gap-1 text-sm">
          <Tally5 size="1em" />
          <div className="text-sm">Sets</div>
        </div>
        <div className="text-xl font-medium tabular-nums">{workoutInfo?.totalSets}</div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="flex items-center gap-1 text-sm">
          <Boxes size="1em" />
          <div>Volume</div>
        </div>
        <div className="text-xl font-medium tabular-nums">{workoutInfo?.volume}kgs</div>
      </div>
    </div>
  )
}
