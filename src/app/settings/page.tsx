import { Metadata } from "next"

import { Account } from "./account"
import { System } from "./system"

export const metadata: Metadata = {
  title: "Settings | mfloww",
}

export default function Settings() {
  return (
    <div className="custom-container custom-min-h">
      <div className="grid gap-2 pt-4 items-center">
        <Account />
        <System />
      </div>
    </div>
  )
}
