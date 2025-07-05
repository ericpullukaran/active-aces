import BottomNavigation from "~/components/navigation/BottomNavigation"
import { TimerProvider } from "~/components/dashboard-screen/TimerProvider"
import { WhenHydrated } from "~/lib/utils/WhenHydrated"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <WhenHydrated>
      <TimerProvider>
        <div className="mx-4 max-w-7xl">{children}</div>

        <BottomNavigation />
      </TimerProvider>
    </WhenHydrated>
  )
}
