import { Metadata } from "next"

import { BetaAcessForm } from "./beta-access-form"

export const metadata: Metadata = {
  title: "Closed Beta Access | mfloww",
}

export default function ClosedBetaAccess() {
  return (
    <div className="custom-container relative flex flex-col custom-min-h w-[350px] md:w-[500px]">
      <div className="flex flex-col flex-grow justify-center gap-4 md:gap-8">
        <div className="mx-auto flex flex-col justify-center space-y-6">
          <>
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Closed Beta Access
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome to the closed beta phase of mfloww!
              </p>
              <p className="text-sm text-muted-foreground">
                Please enter the one-time access code provided to you.
              </p>
              <div className="self-center">
                <BetaAcessForm />
              </div>
            </div>
          </>
        </div>
      </div>
    </div>
  )
}
