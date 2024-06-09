import { DBContextProvider } from "@/lib/local-db/provider"
import { DashboardStateContextProvider } from "@/app/dashboard/dashboard-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DBContextProvider>
        <DashboardStateContextProvider>
          <main>{children}</main>
        </DashboardStateContextProvider>
      </DBContextProvider>
    </div>
  )
}
