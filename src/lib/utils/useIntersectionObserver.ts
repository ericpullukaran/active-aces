import { useEffect, useRef } from "react"

export function useIntersectionObserver(
  callback: () => void,
  enabled: boolean,
  opts: IntersectionObserverInit = { threshold: 0.1 },
) {
  const observerTargetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && enabled) {
        callback()
      }
    }, opts)

    if (observerTargetRef.current) {
      observer.observe(observerTargetRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [callback, enabled, opts])

  return observerTargetRef
}
