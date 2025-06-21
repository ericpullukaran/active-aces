"use client"

import { useState } from "react"
import type { Transition } from "motion/react"

enum Direction {
  Left = -1,
  Right = 1,
}

export const tabTransition: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.3,
}

export const directionalVariants = {
  enter: (direction: Direction) => ({
    x: direction * 100,
    opacity: 0,
  }),
  target: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction * -100,
    opacity: 0,
  }),
}

export type TabItem = {
  id: string
  title: string
}

export function useTabAnimation<T extends TabItem>(tabs: T[], defaultTabId?: string) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id)
  const [direction, setDirection] = useState<Direction>(Direction.Right)

  const handleTabChange = (tabId: string) => {
    const currIdx = tabs.findIndex((tab) => tab.id === activeTab)
    const nextIdx = tabs.findIndex((tab) => tab.id === tabId)

    setDirection(nextIdx > currIdx ? Direction.Right : Direction.Left)
    setActiveTab(tabId)
  }

  return {
    activeTab,
    setActiveTab: handleTabChange,
    direction,
  }
}
