import { DashboardNav } from "@/components/dashboard/nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <DashboardNav />
      <main>{children}</main>
    </div>
  )
}
