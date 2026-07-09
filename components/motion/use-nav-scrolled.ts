"use client"

import { useEffect, useState } from "react"
import { useMotionValueEvent, useScroll } from "motion/react"

/**
 * Derived from design-taste-frontend Section 5.D scroll listener replacement guidance.
 */
export function useNavScrolled() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 10)
  })

  useEffect(() => {
    setScrolled(scrollY.get() > 10)
  }, [scrollY])

  return scrolled
}
