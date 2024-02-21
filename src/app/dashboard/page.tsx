import { DashboardWrapper } from "./wrapper"

export default function Dashboard() {
  return (
    <div className="custom-container custom-min-h">
      <div className="flex flex-col gap-2 pt-4">
        <DashboardWrapper />
      </div>
    </div>
  )
}
