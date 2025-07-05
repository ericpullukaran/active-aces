import { getDurationFrom } from "~/lib/utils/dates"
import { useIntervalValue } from "~/lib/utils/useIntervalValue"
import { TimeDisplay } from "./TimeDisplay"

export const Stopwatch = (props: { from: Date | string | null | undefined }) => {
  const formattedTimeLeft = useIntervalValue(() => getDurationFrom(props.from), 50)
  return <TimeDisplay formattedTime={formattedTimeLeft} />
}
