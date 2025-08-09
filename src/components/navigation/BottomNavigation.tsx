"use client"
import React from "react"
import { motion, LayoutGroup, type Transition } from "motion/react"
import { Home, Clock } from "lucide-react"
import { cn } from "~/lib/utils"
import { WorkoutButton } from "./WorkoutButton"
import { ExercisesButton } from "./ExercisesButton"
import { TimerOverlay } from "../TimerOverlay"
import { useSnapshot } from "valtio"
import { navigationActions, navigationStore } from "~/lib/stores/navigationStore"
import { UserMenuButton } from "./UserMenuButton"

export type AppPage = "home" | "history" | "workout" | "exercises" | "settings"

const activeIndicatorTransition: Transition = {
  type: "spring",
  ease: "easeOut",
  duration: 0.5,
  bounce: 0.3,
}

export default function BottomNavigation() {
  return (
    <div className="fixed inset-x-0 bottom-10 mx-3 flex flex-col items-center gap-8">
      <TimerOverlay />
      <motion.div
        layoutRoot
        style={{ originY: "top" }}
        className="bg-secondary/60 relative flex w-full max-w-lg items-center justify-between overflow-hidden rounded-full px-3 py-1 text-gray-300 backdrop-blur-3xl"
      >
        <LayoutGroup id="bottom-navigation">
          {/* Home Button */}
          <NavButton
            Icon={Home}
            page="home"
            onClick={() => navigationActions.setCurrentPage("home")}
          />

          {/* History Button */}
          <NavButton
            Icon={Clock}
            page="history"
            onClick={() => navigationActions.setCurrentPage("history")}
          />

          {/* Dynamic Middle Button */}
          <WorkoutButton />

          {/* Exercises/Add Exercise Button */}
          <ExercisesButton />

          {/* Profile/Settings Popover */}
          <UserMenuButton />
        </LayoutGroup>
      </motion.div>
    </div>
  )
}

const NavButton = ({
  Icon,
  page,
  onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>
  page: AppPage
  onClick: () => void
}) => {
  const observableNavigation = useSnapshot(navigationStore)
  const currentPage = observableNavigation.currentPage

  return (
    <motion.button
      layout
      style={{ originY: "top" }}
      className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
      onClick={onClick}
    >
      <Icon className={cn(currentPage === page ? "text-white" : "text-gray-400")} />
      {currentPage === page && (
        <motion.div
          className="absolute -bottom-2 h-2 w-2 rounded-full bg-white shadow-lg shadow-white/50 blur-xs"
          transition={activeIndicatorTransition}
          layoutId="activeIndicator"
        />
      )}
    </motion.button>
  )
}
