"use client"

import { type MouseEvent, type ReactNode, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { motionSpring, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Derived from design-taste-frontend Section 5 magnetic micro-physics.
 */
type MagneticHoverProps = {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticHover({ children, strength = 24, className }: MagneticHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mappedX = useTransform(x, (value) => value)
  const mappedY = useTransform(y, (value) => value)

  const springX = useSpring(mappedX, motionSpring)
  const springY = useSpring(mappedY, motionSpring)

  const handlePointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduce || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const offsetX = event.clientX - (rect.left + rect.width / 2)
    const offsetY = event.clientY - (rect.top + rect.height / 2)

    x.set((offsetX / rect.width) * strength * 2)
    y.set((offsetY / rect.height) * strength * 2)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={reset}
      className={className}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  )
}
