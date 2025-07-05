import type { Dispatch, SetStateAction } from "react"
import { useCallback, useEffect, useState } from "react"
import SuperJSON from "superjson"

const localStorage = typeof window === "undefined" ? null : window.localStorage

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [get: T, set: Dispatch<SetStateAction<T>>, clear: () => void] => {
  const [state, setState] = useState<T>(() => {
    const cached = localStorage?.getItem(key)

    if (!cached) return initialValue

    try {
      return SuperJSON.parse(cached) as T
    } catch (err) {
      console.error(`Error parsing localStorage item ${key}:`, err)
      return initialValue
    }
  })

  useEffect(() => {
    if (localStorage) {
      localStorage.setItem(key, SuperJSON.stringify(state))
    } else {
      console.error("localStorage is not available on server")
    }
  }, [state, key])

  const clearState = useCallback(() => {
    setState(initialValue)
  }, [initialValue])

  return [state, setState, clearState]
}
