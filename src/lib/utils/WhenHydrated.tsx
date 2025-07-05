"use client"

import type { ReactNode } from "react"

import { useHydrated } from "./use-hydrated"

export const WhenHydrated = (props: { children: ReactNode; fallback?: ReactNode }) => {
  const hydrated = useHydrated()

  return hydrated ? props.children : props.fallback
}
