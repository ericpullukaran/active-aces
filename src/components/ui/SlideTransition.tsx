"use client"

import React, { useRef, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "motion/react"

type SlideTransitionProps = {
  currentIndex: number
  children: React.ReactNode
  className?: string
}

export default function SlideTransition({
  currentIndex,
  children,
  className = "",
}: SlideTransitionProps) {
  const prevIndexRef = useRef(currentIndex)
  const [direction, setDirection] = useState(0)

  if (currentIndex !== prevIndexRef.current) {
    const newDirection = currentIndex > prevIndexRef.current ? -1 : 1
    setDirection(newDirection)
    prevIndexRef.current = currentIndex
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
