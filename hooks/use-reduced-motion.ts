"use client"

import { useReducedMotion as useFramerReducedMotion } from "framer-motion"

/**
 * Exposes the user's reduced-motion preference as a simple boolean.
 */
export function useReducedMotion(): boolean {
  return Boolean(useFramerReducedMotion())
}
