import { DBContextProvider } from "@/lib/local-db/provider"
import { DashboardStateContextProvider } from "@/components/dashboard/dashboard-state-context-provider"
import { DashboardNav } from "@/components/dashboard/nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DBContextProvider>
        <DashboardStateContextProvider>
          <DashboardNav />
          <main>{children}</main>
        </DashboardStateContextProvider>
      </DBContextProvider>
    </div>
  )
}
