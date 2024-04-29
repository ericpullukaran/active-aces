import { useEffect, useRef, useState } from "react";

export default function AnimatedVisibility({
  children,
  isVisible,
  dependency,
  initialHeight = null,
  initialWidthPercentage = 0,
}: {
  children: React.ReactNode;
  isVisible: boolean;
  dependency?: unknown;
  initialHeight?: number | null;
  initialWidthPercentage?: number;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">(
    initialHeight ?? "auto",
  );
  const [widthPercentage, setWidthPercentage] = useState(
    initialWidthPercentage,
  );

  useEffect(() => {
    if (isVisible && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
      setWidthPercentage(100);
    } else {
      setHeight(initialHeight ?? "auto");
      setWidthPercentage(initialWidthPercentage);
    }
  }, [isVisible, dependency, initialHeight, initialWidthPercentage]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "500ms ease",
        height: height === "auto" ? "auto" : `${height}px`,
        width: `${widthPercentage}%`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
