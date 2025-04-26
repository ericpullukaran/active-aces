"use client"
import React from "react"
import { motion, LayoutGroup, Transition } from "motion/react"
import { Home, Clock } from "lucide-react"
import AuthButton from "../AuthButton"
import { cn } from "~/lib/utils"
import { WorkoutButton } from "./WorkoutButton"
import { ExercisesButton } from "./ExercisesButton"
import { useWorkoutManager } from "../dashboard-screen/WorkoutManagerProvider"

export type AppPage = "home" | "history" | "workout" | "exercises"

const activeIndicatorTransition: Transition = {
  type: "spring",
  ease: "easeOut",
  duration: 0.5,
  bounce: 0.3,
}

const BottomNavigation = () => {
  const { currentPage, setCurrentPage } = useWorkoutManager()

  return (
    <div className="fixed inset-x-0 bottom-6 mx-3 flex flex-col items-center gap-8">
      <motion.div
        layout
        className="bg-card/70 relative flex w-full max-w-lg items-center justify-between overflow-hidden rounded-full px-3 py-1 text-gray-300 backdrop-blur-3xl"
      >
        <LayoutGroup>
          {/* Home Button */}
          <NavButton
            Icon={Home}
            page="home"
            currentPage={currentPage}
            onClick={() => setCurrentPage("home")}
          />

          {/* History Button */}
          <NavButton
            Icon={Clock}
            page="history"
            currentPage={currentPage}
            onClick={() => setCurrentPage("history")}
          />

          {/* Dynamic Middle Button */}
          <WorkoutButton />

          {/* Exercises/Add Exercise Button */}
          <ExercisesButton />

          {/* Profile Button */}
          <motion.button
            layout
            className="relative flex h-14 w-10 flex-col items-center justify-center p-2"
          >
            <AuthButton />
          </motion.button>
        </LayoutGroup>
      </motion.div>
    </div>
  )
}

const NavButton = ({
  Icon,
  page,
  currentPage,
  onClick,
}: {
  Icon: React.ComponentType<{ className?: string }>
  page: AppPage
  currentPage: AppPage
  onClick: () => void
}) => {
  return (
    <motion.button
      layout
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

export default BottomNavigation
