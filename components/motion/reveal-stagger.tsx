"use client"

import type { JSX, ReactNode } from "react"
import { motion } from "motion/react"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Derived from design-taste-frontend Section 5.C Scroll-Reveal Stagger.
 */
type RevealStaggerProps = {
  children: ReactNode[]
  delay?: number
  staggerMs?: number
  amount?: number
  as?: keyof JSX.IntrinsicElements
  className?: string
}

export function RevealStagger({
  children,
  delay = 0,
  staggerMs = 60,
  amount = 0.3,
  as = "div",
  className,
}: RevealStaggerProps) {
  const reduce = useReducedMotionSafe()
  const canObserve = typeof window !== "undefined" && "IntersectionObserver" in window
  const revealWithViewport = !reduce && canObserve
  const Wrapper = as

  return (
    <Wrapper className={className}>
      {children.map((child, index) => (
        <motion.div
          key={index}
          initial={revealWithViewport ? { opacity: 0, y: 24 } : false}
          animate={revealWithViewport ? undefined : { opacity: 1, y: 0 }}
          whileInView={revealWithViewport ? { opacity: 1, y: 0 } : undefined}
          viewport={revealWithViewport ? { once: true, amount } : undefined}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 0.6,
                  delay: delay + (staggerMs * index) / 1000,
                  ease: motionEase.expoOut,
                }
          }
        >
          {child}
        </motion.div>
      ))}
    </Wrapper>
  )
}
