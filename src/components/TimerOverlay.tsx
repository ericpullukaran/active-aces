"use client"
import React from "react"
import { AnimatePresence } from "motion/react"
import { useWorkoutManager } from "./dashboard-screen/WorkoutManagerProvider"
import { CountdownTimer } from "./CountdownTimer"
import { StopwatchBar } from "./StopwatchBar"

export function TimerOverlay() {
  const { timerDurationSeconds, setTimerDurationSeconds, stopStopwatch, activeStopwatchSetInfo } =
    useWorkoutManager()

  return (
    <AnimatePresence>
      {timerDurationSeconds > 0 && (
        <CountdownTimer
          key={`timer`}
          durationInSeconds={timerDurationSeconds}
          onComplete={() => setTimerDurationSeconds(0)}
        />
      )}

      {activeStopwatchSetInfo && (
        <StopwatchBar
          key={`stopwatch`}
          initialSeconds={activeStopwatchSetInfo?.initialSeconds}
          onComplete={stopStopwatch}
          autoStart={true}
        />
      )}
    </AnimatePresence>
  )
}
