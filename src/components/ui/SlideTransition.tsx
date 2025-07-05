"use client"

import React, { useRef, useState } from "react"
import { AnimatePresence, motion, MotionConfig, type PanInfo } from "motion/react"

type SlideTransitionProps = {
  currentIndex: number
  children: React.ReactNode
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

const SWIPE_THRESHOLD = 50
const VELOCITY_THRESHOLD = 200

export default function SlideTransition({
  currentIndex,
  children,
  className = "",
  onSwipeLeft,
  onSwipeRight,
}: SlideTransitionProps) {
  const prevIndexRef = useRef(currentIndex)
  const [direction, setDirection] = useState(0)

  if (currentIndex !== prevIndexRef.current) {
    const newDirection = currentIndex > prevIndexRef.current ? -1 : 1
    setDirection(newDirection)
    prevIndexRef.current = currentIndex
  }

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x

    if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD) {
      if (offset > 0 || velocity > 0) {
        onSwipeRight?.()
      } else if (offset < 0 || velocity < 0) {
        onSwipeLeft?.()
      }
    }
  }

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <motion.div className={`overflow-hidden ${className}`}>
        <div>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              variants={slideVariants}
              initial="initial"
              animate="active"
              exit="exit"
              custom={direction}
              className="w-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ cursor: "grab" }}
              whileDrag={{ cursor: "grabbing" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  )
}

const slideVariants = {
  initial: (direction: number) => ({
    x: 100 * direction,
    opacity: 0,
  }),
  active: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: -100 * direction,
    opacity: 0,
  }),
}
