"use client"

import * as React from "react"
import { cn } from "~/lib/utils"
import { dayjs, parseTimeToSeconds } from "~/lib/utils/dates"
import { Input } from "~/components/ui/input"

type TimeInputProps = Omit<React.ComponentProps<"input">, "onBlur" | "value"> & {
  value?: string
  onBlur?: (value: string) => void
}

export const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, value = "", onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value)

    React.useEffect(() => {
      setDisplayValue(value)
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const newDigits = inputValue.replace(/\D/g, "")

      if (!newDigits) {
        setDisplayValue("")
        return
      }

      let formatted = newDigits
      if (newDigits.length > 2) {
        // Insert colon before last 2 digits
        formatted = newDigits.slice(0, -2) + ":" + newDigits.slice(-2)
        // If more than 4 digits, add another colon
        if (newDigits.length > 4) {
          formatted = formatted.slice(0, -5) + ":" + formatted.slice(-5)
        }
      }

      setDisplayValue(formatted)
    }

    const handleBlur = () => {
      // Normalize the time value
      const seconds = parseTimeToSeconds(displayValue)

      const shouldShowHours = seconds >= 3600
      const format = shouldShowHours ? "HH:mm:ss" : "mm:ss"

      const normalized = dayjs.duration(seconds, "seconds").format(format)

      setDisplayValue(normalized)

      if (onBlur) {
        onBlur(normalized)
      }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
      if (props.onFocus) {
        props.onFocus(e)
      }
    }

    return (
      <Input
        className={cn("text-center", className)}
        type="text"
        inputMode="numeric"
        pattern="[0-9:]*"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={"00:00"}
        ref={ref}
        {...props}
      />
    )
  },
)
