import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const MOBILE_VIEWPORT_WIDTH = 640
export const MOBILE_VIEWPORT = `(max-width: ${MOBILE_VIEWPORT_WIDTH}px)`

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
