import { EntryType } from "@/lib/definitions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Icons } from "../icons"

export function RegularEntryIndicator({
  type,
  className,
}: {
  type: EntryType
  className?: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <Icons.repeat className="w-5 h-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>Regular {type}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
