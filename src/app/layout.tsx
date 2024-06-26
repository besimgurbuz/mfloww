import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

import { MAIN_METADATA } from "@/lib/metadata"

import { UserProvider } from "./user-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = MAIN_METADATA
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <footer className="py-6 md:px-8 md:py-0 mt-4">
              <div className="custom-container flex flex-col items-center text-center gap-1 md:h-24 md:flex-row">
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
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
