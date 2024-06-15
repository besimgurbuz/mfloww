"use client"

import { SUPPORTED_CURRENCY_CODES } from "@/lib/definitions"
import { useStorage } from "@/lib/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeModeToggle } from "@/components/theme-mode-toggle"

export function System() {
  const [baseCurrency, setBaseCurrency] = useStorage(
    "SELECTED_BASE_CURRENCY",
    "localStorage",
    "USD"
  )
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Base Currency</Label>
            <Select
              value={baseCurrency}
              onValueChange={(currency) => setBaseCurrency(currency)}
            >
              <SelectTrigger>
                <SelectValue>{baseCurrency}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCY_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Theme</Label>
            <ThemeModeToggle />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
