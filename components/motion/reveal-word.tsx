"use client"

import { motion } from "motion/react"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Derived from design-taste-frontend Section 5.C staggered text reveal.
 */
type RevealWordProps = {
  text: string
  className?: string
  delay?: number
}

export function RevealWord({ text, className, delay = 0 }: RevealWordProps) {
  const reduce = useReducedMotionSafe()
  const canObserve = typeof window !== "undefined" && "IntersectionObserver" in window
  const revealWithViewport = !reduce && canObserve
  const words = text.trim().split(/\s+/)

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block pr-[0.35em]"
          initial={revealWithViewport ? { opacity: 0, y: 18 } : false}
          animate={revealWithViewport ? undefined : { opacity: 1, y: 0 }}
          whileInView={revealWithViewport ? { opacity: 1, y: 0 } : undefined}
          viewport={revealWithViewport ? { once: true, amount: 0.7 } : undefined}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 0.5,
                  delay: delay + index * 0.06,
                  ease: motionEase.expoOut,
                }
          }
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
