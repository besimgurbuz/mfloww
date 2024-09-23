"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export function ThemeColorMeta() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themeColor = theme === "dark" ? "#020817" : "#ffffff"

  return (
    <>
      <meta name="theme-color" content={themeColor} />
    </>
  )
}
