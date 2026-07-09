"use client"

import { useReducedMotion as useMotionReducedMotion } from "motion/react"

type SpringConfig = {
  stiffness: number
  damping: number
  mass: number
}

type MotionEaseMap = {
  expoOut: [number, number, number, number]
  quartOut: [number, number, number, number]
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Exposes the user's reduced-motion preference as a simple boolean.
 */
export function useReducedMotionSafe(): boolean {
  return Boolean(useMotionReducedMotion())
}

/**
 * Backward-compatible alias for existing consumers.
 */
export function useReducedMotion(): boolean {
  return useReducedMotionSafe()
}

/**
 * Picks fallback motion values when reduced motion is enabled.
 */
export function withReducedMotion<T>(motion: T, fallback: T): T {
  return prefersReducedMotion() ? fallback : motion
}

export const motionSpring: Readonly<SpringConfig> = Object.freeze({
  stiffness: 220,
  damping: 28,
  mass: 0.8,
})

export const motionEase: Readonly<MotionEaseMap> = Object.freeze({
  expoOut: [0.16, 1, 0.3, 1],
  quartOut: [0.25, 1, 0.5, 1],
})
