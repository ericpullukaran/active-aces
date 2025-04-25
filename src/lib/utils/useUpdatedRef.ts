import { useEffect, useRef } from "react"

/**
 * Returns a ref that always contains the latest value while maintaining a stable identity.
 * Solves the stale closure problem in callbacks without triggering rerenders.
 */
export const useUpdatedRef = <T>(value: T) => {
  const ref = useRef<T>(value)

  useEffect(() => {
    ref.current = value
  })

  return ref
}
