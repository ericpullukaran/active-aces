"use client"
import React from "react"
import { AnimatePresence } from "motion/react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { CountdownTimer } from "./CountdownTimer"

export function TimerOverlay() {
  const { timerDurationSeconds, setTimerDurationSeconds } = useWorkoutManager()

  return (
    <AnimatePresence>
      {timerDurationSeconds > 0 && (
        <CountdownTimer
          durationInSeconds={timerDurationSeconds}
          onComplete={() => setTimerDurationSeconds(0)}
        />
      )}
    </AnimatePresence>
  )
}
