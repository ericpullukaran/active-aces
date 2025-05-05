import { formatTimeValue } from "~/lib/utils/dates"
import { useIntervalValue } from "~/lib/utils/useIntervalValue"
import { TimeDisplay } from "./TimeDisplay"
import { X } from "lucide-react"
import { TimerReset } from "lucide-react"
import { Button } from "./ui/button"
import { useRef, useEffect } from "react"
import { Pause } from "lucide-react"
import { useState } from "react"
import { motion } from "motion/react"
import { Play } from "lucide-react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"

export const StopwatchBar = (props: {
  onComplete?: (elapsedSeconds: number) => void
  autoStart?: boolean
  initialSeconds?: number
}) => {
  const { updateStopwatchElapsedTime } = useWorkoutManager()
  const { onComplete, autoStart = true, initialSeconds = 0 } = props
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)

  const initialSecondsRef = useRef(initialSeconds)
  const startTimeRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const totalPausedTimeRef = useRef(0)

  useEffect(() => {
    initialSecondsRef.current = initialSeconds
    if (autoStart) {
      startTimeRef.current = Date.now() - initialSeconds * 1000
    }
  }, [autoStart, initialSeconds, onComplete])

  const getElapsedTime = () => {
    if (!isRunning || !startTimeRef.current) return initialSecondsRef.current

    const now = Date.now()
    const currentTime = isPaused ? pausedAtRef.current! : now

    const elapsedMs = currentTime - startTimeRef.current - totalPausedTimeRef.current
    const elapsedSeconds = Math.floor(elapsedMs / 1000)

    return elapsedSeconds
  }

  const elapsedSeconds = useIntervalValue(getElapsedTime, 50)
  const formattedTimeElapsed = formatTimeValue(elapsedSeconds)

  useEffect(() => {
    updateStopwatchElapsedTime(elapsedSeconds)
  }, [elapsedSeconds, updateStopwatchElapsedTime])

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - initialSecondsRef.current * 1000
      totalPausedTimeRef.current = 0
      setIsRunning(true)
      setIsPaused(false)
    }
  }

  const pause = () => {
    if (isRunning && !isPaused) {
      pausedAtRef.current = Date.now()
      setIsPaused(true)
    }
  }

  const resume = () => {
    if (isRunning && isPaused && pausedAtRef.current) {
      totalPausedTimeRef.current += Date.now() - pausedAtRef.current
      pausedAtRef.current = null
      setIsPaused(false)
    } else {
      start()
    }
  }

  const reset = () => {
    setIsPaused(true)
    setIsRunning(false)
    initialSecondsRef.current = 0
    startTimeRef.current = null
    pausedAtRef.current = null
    totalPausedTimeRef.current = 0
  }

  const togglePause = () => {
    if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  const finish = () => {
    onComplete?.(elapsedSeconds)
    reset()
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="bg-primary absolute inset-x-4 bottom-20 mx-auto flex justify-between gap-2 rounded-full px-4 py-3 shadow-lg backdrop-blur-3xl"
    >
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-amber-900/60 hover:bg-amber-900/80"
        onClick={togglePause}
      >
        {isPaused ? <Play size={20} /> : <Pause size={20} />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-600/70 hover:bg-gray-600/90"
        onClick={reset}
      >
        <TimerReset size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full bg-gray-600/70 hover:bg-gray-600/90"
        onClick={finish}
      >
        <X size={20} />
      </Button>

      <div className="flex-1 place-items-end justify-items-end">
        <div className="flex items-end gap-2">
          <div className="text-4xl font-bold tabular-nums">
            <TimeDisplay formattedTime={formattedTimeElapsed} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
