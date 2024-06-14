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
}

const Input = React.forwardRef<HTMLInputElement, InputGroupProps>(
  ({ prefix, suffix, className, ...props }, ref) => {
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
          ref={ref}
          {...props}
        />
        {suffix && (
          <div className="flex items-center w-fit h-9 border-l">{suffix}</div>
        )}
      </div>
    )
  }
)

Input.displayName = "InputGroup"

export { BaseInput, Input }
