import { useEffect, useRef, useState } from "react";

export default function AnimatedVisibility({
  children,
  isVisible,
  dependency,
  initalHeight = -1,
  initalWidth = 0,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  dependency?: unknown;
  initalHeight?: number;
  initalWidth?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(initalHeight);
  const [width, setWidth] = useState(initalWidth);

  useEffect(() => {
    console.log("congtent", contentRef.current);

    if (isVisible && contentRef.current) {
      console.log("visible");

      setHeight(contentRef.current.scrollHeight);
      setWidth(100);
    } else {
      console.log("setting heigh", initalHeight);

      setHeight(initalHeight);
      setWidth(initalWidth);
    }
  }, [isVisible, dependency, initalHeight, initalWidth]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "500ms ease",
        ...(initalHeight !== -1 ? { height: `${height}px` } : {}),
        width: `${width}%`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
