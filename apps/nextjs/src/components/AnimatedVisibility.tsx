import { useEffect, useRef, useState } from "react";

export default function AnimatedVisibility({
  children,
  isVisible,
  dependency,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  dependency?: unknown;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isVisible && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isVisible, dependency]);

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
  );
}
