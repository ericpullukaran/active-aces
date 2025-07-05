import { SlidingNumber } from "./ui/sliding-number"

type TimerDisplayProps = {
  formattedTime: string
  className?: string
}

export const TimeDisplay = ({ formattedTime, className }: TimerDisplayProps) => {
  const parts =
    formattedTime === "" ? [0, 0] : formattedTime.split(":").map((part) => parseInt(part, 10))

  return (
    <div className={`flex items-center ${className || ""}`}>
      {parts.map((value, index) => (
        <div key={`time-part-${index}`} className="flex items-center">
          {index > 0 && <span className="mx-0.5">:</span>}
          <SlidingNumber value={value} padStart={true} />
        </div>
      ))}
    </div>
  )
}
