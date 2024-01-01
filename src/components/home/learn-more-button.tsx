"use client"

import { Button } from "@/components/ui/button"

export function LearnMoreButton() {
  return (
    <Button
      onClick={() =>
        document.getElementById("learn-more-section")?.scrollIntoView({
          behavior: "smooth",
        })
      }
    >
      Learn More
    </Button>
  )
}
