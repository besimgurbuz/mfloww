import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons"
import { cva } from "class-variance-authority"

import { MontlyDifference as MontlyDifferenceType } from "@/lib/definitions"
import { Badge } from "@/components/ui/badge"

type MontlyDifferenceProps = {
  difference: MontlyDifferenceType
}

const montlyDifferenceVariants = cva("", {
  variants: {
    increased: {
      true: "",
      false: "",
    },
    type: {
      income: "",
      expense: "",
    },
  },
  compoundVariants: [
    {
      type: "income",
      increased: true,
      class: "success",
    },
    {
      type: "income",
      increased: false,
      class: "destructive",
    },
    {
      type: "expense",
      increased: true,
      class: "destructive",
    },
    {
      type: "expense",
      increased: false,
      class: "success",
    },
  ],
})

export function MontlyDifference({ difference }: MontlyDifferenceProps) {
  return (
    <span className="text-muted-foreground text-sm flex gap-2">
      <Badge
        variant={
          montlyDifferenceVariants({
            type: difference.type,
            increased: difference.isIncreased,
          }) as "success" | "destructive"
        }
      >
        {difference.isIncreased ? (
          <ArrowUpIcon className="w-4 h-4" />
        ) : (
          <ArrowDownIcon className="w-4 h-4" />
        )}
        {difference.percentage.toFixed(2)}%
      </Badge>{" "}
      vs last month
    </span>
  )
}
