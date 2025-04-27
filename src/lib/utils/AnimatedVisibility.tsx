import { useEffect, useRef, useState } from "react"

export default function AnimatedVisibility({
  children,
  isVisible,
  dependency,
}: {
  children: React.ReactNode
  isVisible: boolean
  dependency?: unknown
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      if (isVisible && contentRef.current) {
        setHeight(contentRef.current.scrollHeight)
      } else {
        setHeight(0)
      }
      // TODO: This is a hack to ensure the correct height is set
      // since after swiping/deleting a set, even tho this runs
      // immediately, the height is not correct.
    }, 10)
  }, [isVisible, dependency])

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "height 250ms ease",
        height: `${height}px`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  )
}
