import { DBContextProvider } from "@/lib/db/provider"
import { DashboardNav } from "@/components/dashboard/nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DBContextProvider>
        <DashboardNav />
        <main>{children}</main>
      </DBContextProvider>
    </div>
  )
}
