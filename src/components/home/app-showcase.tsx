"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export function AppShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const screens = ["dashboard", "charts", "settings"]

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % screens.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [screens.length])

  if (!mounted) return null

  return (
    <div className="w-full py-8 md:py-12 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {screens.map((screen, index) => (
              <div
                key={`${screen}-${theme}`}
                className={`absolute transition-all duration-700 ease-in-out
                  ${
                    index === currentIndex
                      ? "opacity-100 scale-100 translate-x-0 z-20"
                      : index === (currentIndex + 1) % screens.length
                        ? "opacity-0 sm:opacity-60 scale-90 translate-x-[30%] z-10"
                        : "opacity-0 sm:opacity-30 scale-80 -translate-x-[30%] z-0"
                  }`}
              >
                <div className="relative w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-[9/19] rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={`/images/screenshots/${screen}-${theme}.png`}
                    alt={`mfloww ${screen} screen (${theme} mode)`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-200"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flex justify-center space-x-2">
          {screens.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300
                ${
                  index === currentIndex
                    ? "bg-gray-800 dark:bg-gray-200 scale-125"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
