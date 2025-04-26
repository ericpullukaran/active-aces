import BottomNavigation from "~/components/navigation/BottomNavigation"
import { WorkoutManagerProvider } from "~/components/dashboard-screen/WorkoutManagerProvider"
import { WhenHydrated } from "~/lib/utils/WhenHydrated"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WhenHydrated>
      <WorkoutManagerProvider initialPage="home">
        <div className="mx-4 max-w-7xl">{children}</div>
        <BottomNavigation />
      </WorkoutManagerProvider>
    </WhenHydrated>
  )
}
