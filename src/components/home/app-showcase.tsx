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
    <div className="flex flex-col gap-4 items-center justify-center">
      <div className="relative flex items-center justify-center w-[290px] h-[598px] rounded-[49px] bg-[#414141]">
        <div className="relative flex items-center justify-center w-[264px] h-[575px] rounded-[36px]">
          {screens.map((_, index) => (
            <Image
              key={index}
              src={`/images/screenshots/${screens[index]}-${theme}.png`}
              alt={`mfloww ${screens[index]} screen (${theme} mode)`}
              objectFit="cover"
              width={264}
              height={575}
              className={`absolute rounded-[36px] transition-opacity ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        {/* Buttons */}
        <div className="absolute h-7 w-1 bg-[#292929] -left-[2px] top-[118px] rounded-l-[2px] -z-10"></div>
        <div className="absolute h-12 w-1 bg-[#292929] -left-[2px] top-[172px] rounded-l-[2px] -z-10"></div>
        <div className="absolute h-12 w-1 bg-[#292929] -left-[2px] top-[227px] rounded-l-[2px] -z-10"></div>
        <div className="absolute h-[72px] w-1 bg-[#292929] -right-[2px] top-[190px] rounded-r-[2px] -z-10"></div>
      </div>
      <div className="flex justify-center space-x-2">
        {screens.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "bg-gray-800 dark:bg-gray-200 scale-125"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
