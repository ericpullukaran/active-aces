import NavBar from "~/components/NavBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <div className="mx-auto max-w-7xl py-6">{children}</div>
    </div>
  )
}
