"use client";

import type { ReactNode } from "react";

import { useHydrated } from "~/utils/use-hydrated";

export const WhenHydrated = (props: { children: ReactNode }) => {
  const hydrated = useHydrated();

  return hydrated ? props.children : null;
};
