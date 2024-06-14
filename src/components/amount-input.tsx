import React from "react"

import { Input } from "@/components/ui/input"

type AmountInputProps = {
  defaultValue?: number
  name: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  onChange: (value: number) => void
}

const AmountInput = React.forwardRef<HTMLInputElement, AmountInputProps>(
  ({ defaultValue, name, prefix, suffix, onChange }, ref) => {
    const [value, setValue] = React.useState("")
    const formatNumber = (num: string) => {
      if (!num) return ""
      const parts = num.split(".")
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      return parts.join(".")
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      value = value.replace(/[^\d.]/g, "")

      const parts = value.split(".")
      if (parts.length > 2) {
        parts.splice(2)
      }
      value = parts.join(".")

      setValue(formatNumber(value))
      onChange(parseFloat(value))
    }
    React.useEffect(() => {
      if (defaultValue) {
        setValue(formatNumber(defaultValue.toString()))
      }
    }, [defaultValue])

    return (
      <Input
        ref={ref}
        type="text"
        placeholder="10,000.00"
        name={name}
        value={value}
        onChange={handleChange}
        prefix={prefix}
        suffix={suffix}
      />
    )
  }
)

AmountInput.displayName = "AmountInput"

export { AmountInput }
