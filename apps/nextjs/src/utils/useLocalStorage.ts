import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [get: T, set: Dispatch<SetStateAction<T>>, clear: () => void] => {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached) as T;
        setState(parsed);
      }
    } catch (err) {
      console.error("Failed to parse the cached value from localStorage", err);
    }
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state, key]);

  const clearState = useCallback(() => {
    localStorage.removeItem(key);
    setState(initialValue);
  }, [key, initialValue]);

  return [state, setState, clearState];
};
