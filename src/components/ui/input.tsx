import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const BaseInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
BaseInput.displayName = "Input"

interface InputGroupProps extends Omit<InputProps, "prefix" | "suffix"> {
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  inputRef?: React.Ref<HTMLInputElement>
}

const Input: React.FC<InputGroupProps> = ({
  prefix,
  suffix,
  inputRef,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center rounded-md focus-within:outline-none focus-within:ring-1 focus-within:ring-ring  border border-input",
        className
      )}
    >
      {prefix && (
        <div className="flex items-center w-fit h-9 border-r">{prefix}</div>
      )}
      <BaseInput
        className="flex-grow rounded-none border-none focus-visible:ring-0"
        ref={inputRef}
        {...props}
      />
      {suffix && (
        <div className="flex items-center w-fit h-9 border-l">{suffix}</div>
      )}
    </div>
  )
}

Input.displayName = "InputGroup"

const AmountInput: React.FC<InputGroupProps> = (props) => {
  const [value, setValue] = React.useState("")

  const formatNumber = (num: string) => {
    if (!num) return ""
    const parts = num.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value
    input = input.replace(/[^\d.]/g, "")

    const parts = input.split(".")
    if (parts.length > 2) {
      parts.splice(2)
    }
    input = parts.join(".")

    setValue(formatNumber(input))
  }
  return <Input {...props} type="text" value={value} onChange={handleChange} />
}

AmountInput.displayName = "AmountInput"

export { AmountInput, BaseInput, Input }
