import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { ThemeColorMeta } from "@/components/theme-color-meta"
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
            <ThemeColorMeta />
            <Header />
            {children}
          </ThemeProvider>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
