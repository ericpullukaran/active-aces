import { workoutStore } from "~/lib/stores/workoutStore"
import { Stopwatch } from "./Stopwatch"
import { StopCircle, Tally5, Boxes } from "lucide-react"
import { useSnapshot } from "valtio"

function SetsStats() {
  const snap = useSnapshot(workoutStore)
  const workoutInfo = snap.currentWorkout?.exercises.reduce(
    (acc, exercise) => {
      const exerciseSetsCount = exercise.sets.length
      return {
        totalSets: acc.totalSets + exerciseSetsCount,
      }
    },
    { totalSets: 0 },
  )

  return (
    <div className="border-card flex flex-col items-center justify-center border-r-2 px-4">
      <div className="flex items-center gap-1 text-sm">
        <Tally5 size="1em" />
        <div className="text-sm">Sets</div>
      </div>
      <div className="text-xl font-medium tabular-nums">{workoutInfo?.totalSets ?? 0}</div>
    </div>
  )
}

function VolumeStats() {
  const snap = useSnapshot(workoutStore)
  const workoutInfo = snap.currentWorkout?.exercises.reduce(
    (acc, exercise) => {
      const exerciseVolume = exercise.sets.reduce(
        (setAcc, set) => setAcc + (set.completed ? (set.weight || 0) * (set.reps || 0) : 0),
        0,
      )
      return {
        volume: acc.volume + exerciseVolume,
      }
    },
    { volume: 0 },
  )

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="flex items-center gap-1 text-sm">
        <Boxes size="1em" />
        <div>Volume</div>
      </div>
      <div className="text-xl font-medium tabular-nums">{workoutInfo?.volume ?? 0}kgs</div>
    </div>
  )
}

function StopwatchDisplay() {
  const snap = useSnapshot(workoutStore)

  return (
    <div className="border-card flex flex-1 flex-col items-center justify-center border-r-2">
      <div className="flex items-center gap-1 text-sm">
        <StopCircle size="1em" className="text-destructive animate-pulse" />
        <div>Duration</div>
      </div>
      <div className="text-xl font-medium tabular-nums">
        <Stopwatch from={snap.currentWorkout?.startTime}></Stopwatch>
      </div>
    </div>
  )
}

export default function WorkoutStats() {
  return (
    <div className="bg-secondary/50 sticky top-5 z-10 mb-4 flex w-full overflow-x-scroll rounded-3xl py-5 ring-4 ring-zinc-700/50 brightness-90 backdrop-blur-3xl">
      <StopwatchDisplay />
      <SetsStats />
      <VolumeStats />
    </div>
  )
}
