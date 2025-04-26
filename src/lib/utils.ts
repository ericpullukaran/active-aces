import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const MOBILE_VIEWPORT = "(max-width: 640px)"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
