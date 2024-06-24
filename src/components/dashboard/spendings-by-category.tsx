"use client"

import { useEffect, useState } from "react"

import { SupportedCurrencyCode } from "@/lib/definitions"
import { cn, formatMoney } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type SpendingsByCategoryCardProps = {
  spendingMap: Record<string, number>
  base: SupportedCurrencyCode
}

export function SpendingsByCategoryCard({
  spendingMap,
  base,
}: SpendingsByCategoryCardProps) {
  const [spendingsByCategory, setSpendingsByCategory] = useState<
    { category: string; amount: number }[]
  >([])

  useEffect(() => {
    setSpendingsByCategory(
      Object.entries(spendingMap)
        .sort(([, a], [, b]) => b - a)
        .map(([category, amount]) => ({ category, amount }))
    )
  }, [base, spendingMap])

  if (spendingsByCategory.length === 0) {
    return <></>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <CardTitle>Spendings by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[128px]">
          <div className="grid gap-2">
            {spendingsByCategory.map(({ category, amount }, index) => (
              <div
                key={category}
                className={cn("flex justify-between text-sm", {
                  "text-md font-medium": index === 0,
                })}
              >
                <p className="truncate">{category}</p>
                <p>{formatMoney(amount, base)}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
