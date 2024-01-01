import { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"

import { Header } from "@/components/header"
import { LoadıngProgress } from "@/components/loading-progress"
import { LoadingProgressProvider } from "@/components/loading-progress-provider"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "mfloww",
  description:
    "View your money flow in beautifully designed charts. Keep your data in your device. Encrypted. +25 Currency. Open Source.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProgressProvider>
              <LoadıngProgress />
              <Header />
              {children}
            </LoadingProgressProvider>
            <footer className="py-6 md:px-8 md:py-0">
              <div className="container flex flex-col items-center text-center gap-1 md:h-24 md:flex-row">
                <p className="text-sm text-muted-foreground">
                  Built by{" "}
                  <a
                    href="https://besimgurbuz.dev"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    Besim Gürbüz
                  </a>{" "}
                  with beautiful{" "}
                  <a
                    href="https://ui.shadcn.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    shadcn/ui
                  </a>{" "}
                  components.
                </p>{" "}
                <p className="text-sm text-muted-foreground">
                  The source code is available on{" "}
                  <a
                    href="https://github.com/besimgurbuz/mfloww"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium underline underline-offset-4"
                  >
                    GitHub
                  </a>
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
