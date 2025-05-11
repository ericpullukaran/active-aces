import { useEffect, useRef, useState } from "react"
import { formatTimeValue } from "~/lib/utils/dates"
import { useIntervalValue } from "~/lib/utils/useIntervalValue"
import { TimeDisplay } from "./TimeDisplay"
import { motion } from "motion/react"
import { Pause, Play, TimerReset, X } from "lucide-react"
import { Button } from "./ui/button"

export const CountdownTimer = (props: {
  durationInSeconds: number
  onComplete?: () => void
  autoStart?: boolean
}) => {
  const { durationInSeconds, onComplete, autoStart = true } = props
  const [isRunning, setIsRunning] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)

  const startTimeRef = useRef(autoStart ? Date.now() : null)
  const pausedAtRef = useRef<number | null>(null)
  const totalPausedTimeRef = useRef(0)

  const getRemainingTime = () => {
    if (!isRunning || !startTimeRef.current) return durationInSeconds

    const now = Date.now()

    const currentTime = isPaused ? pausedAtRef.current! : now

    const elapsedMs = currentTime - startTimeRef.current - totalPausedTimeRef.current
    const elapsedSeconds = Math.floor(elapsedMs / 1000)
    const remainingSeconds = Math.max(0, durationInSeconds - elapsedSeconds)

    return remainingSeconds
  }

  const remainingSeconds = useIntervalValue(getRemainingTime, 50)
  const formattedTimeLeft = formatTimeValue(remainingSeconds)

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      reset()
      onComplete?.()
    }
  }, [remainingSeconds, isRunning, onComplete])

  const start = () => {
    if (!isRunning) {
      startTimeRef.current = Date.now()
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
    onComplete?.()
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
          <div className="ml-1 text-sm font-semibold">Timer</div>
          <div className="text-4xl font-bold tabular-nums">
            <TimeDisplay formattedTime={formattedTimeLeft} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
