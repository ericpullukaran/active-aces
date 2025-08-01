"use client"
import React from "react"
import { AnimatePresence } from "motion/react"
import { useTimer } from "./dashboard-screen/TimerProvider"
import { CountdownTimer } from "./CountdownTimer"
import { StopwatchBar } from "./StopwatchBar"

export function TimerOverlay() {
  const { timerDurationSeconds, setTimerDurationSeconds, stopStopwatch, activeStopwatchSetInfo } =
    useTimer()

  return (
    <AnimatePresence>
      {timerDurationSeconds && timerDurationSeconds.duration > 0 && (
        <CountdownTimer
          key={`timer-${timerDurationSeconds.setId}`}
          durationInSeconds={timerDurationSeconds.duration}
          onComplete={() => setTimerDurationSeconds({ setId: "", duration: 0 })}
        />
      )}

      {activeStopwatchSetInfo && (
        <StopwatchBar
          key={`stopwatch-${activeStopwatchSetInfo.setId}`}
          initialSeconds={activeStopwatchSetInfo?.initialSeconds}
          onComplete={stopStopwatch}
          autoStart={true}
        />
      )}
    </AnimatePresence>
  )
}
