import { Icons } from "./icons"
import { Card, CardContent } from "./ui/card"

export function NoDataCard() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center h-full p-0 py-8">
        <h2 className="flex gap-1 text-lg font-medium items-center">
          <Icons.search /> No entry found to display
        </h2>
      </CardContent>
    </Card>
  )
}
