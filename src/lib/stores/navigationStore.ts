import { proxy } from "valtio"
import { type AppPage } from "~/components/navigation/BottomNavigation"

const getInitialPage = (): AppPage => {
  if (typeof window === "undefined") return "home"

  try {
    const storedWorkout = localStorage.getItem("current_workout")
    return storedWorkout ? "workout" : "home"
  } catch {
    return "home"
  }
}

export const navigationStore = proxy<{
  currentPage: AppPage
}>({
  currentPage: getInitialPage(),
})

export const navigationActions = {
  setCurrentPage: (page: AppPage) => {
    navigationStore.currentPage = page
  },
}
