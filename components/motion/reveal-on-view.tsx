"use client"

import type { ReactNode } from "react"
import { motion, type HTMLMotionProps } from "motion/react"
import { motionEase, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Fade-and-rise reveal for a single element as it scrolls into view.
 * Complements RevealStagger (for children lists) and RevealWord (for words).
 */
type SupportedTag = "div" | "section" | "article" | "aside"

type RevealOnViewProps = {
  children: ReactNode
  as?: SupportedTag
  className?: string
  delay?: number
  distance?: number
  amount?: number
  duration?: number
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "animate" | "transition" | "whileInView" | "viewport">

export function RevealOnView({
  children,
  as = "div",
  className,
  delay = 0,
  distance = 24,
  amount = 0.2,
  duration = 0.6,
  ...rest
}: RevealOnViewProps) {
  const reduce = useReducedMotionSafe()
  const canObserve = typeof window !== "undefined" && "IntersectionObserver" in window
  const revealWithViewport = !reduce && canObserve

  const motionProps = {
    className,
    initial: revealWithViewport ? { opacity: 0, y: distance } : false,
    animate: revealWithViewport ? undefined : { opacity: 1, y: 0 },
    whileInView: revealWithViewport ? { opacity: 1, y: 0 } : undefined,
    viewport: revealWithViewport
      ? { once: true, amount, margin: "0px 0px -8% 0px" }
      : undefined,
    transition: reduce
      ? { duration: 0 }
      : { duration, delay, ease: motionEase.expoOut },
    ...rest,
  } as const

  switch (as) {
    case "section":
      return <motion.section {...motionProps}>{children}</motion.section>
    case "article":
      return <motion.article {...motionProps}>{children}</motion.article>
    case "aside":
      return <motion.aside {...motionProps}>{children}</motion.aside>
    case "div":
    default:
      return <motion.div {...motionProps}>{children}</motion.div>
  }
}
