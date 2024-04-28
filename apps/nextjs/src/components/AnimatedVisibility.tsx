import { useEffect, useRef, useState } from "react";

export default function AnimatedVisibility({
  children,
  isVisible,
}: {
  children: React.ReactNode;
  isVisible: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isVisible && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isVisible]);

  return (
    <div
      style={{
        overflow: "hidden",
        transition: "height 500ms ease",
        height: `${height}px`,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
