import { useEffect, useRef } from "react";

export const useUpdatedRef = <T>(value: T) => {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
};
