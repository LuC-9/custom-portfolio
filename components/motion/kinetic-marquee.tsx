"use client"

import type { CSSProperties, ReactNode } from "react"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Derived from design-taste-frontend Section 5 typography marquee guidance.
 */
type KineticMarqueeProps = {
  items: ReactNode[]
  className?: string
  direction?: "left" | "right"
  speedSec?: number
}

export function KineticMarquee({
  items,
  className,
  direction = "left",
  speedSec = 30,
}: KineticMarqueeProps) {
  const reduce = useReducedMotionSafe()
  const doubledItems = [...items, ...items]

  if (reduce) {
    return (
      <div className={`overflow-x-auto no-scrollbar ${className ?? ""}`}>
        <div className="flex w-max items-center gap-6 px-1 py-1">{items}</div>
      </div>
    )
  }

  return (
    <div className={`group overflow-hidden ${className ?? ""}`}>
      <div
        className={`animate-marquee flex w-max items-center gap-6 hover:[animation-play-state:paused] ${
          direction === "right" ? "reverse" : ""
        }`}
        style={{ "--marquee-duration": `${speedSec}s` } as CSSProperties}
      >
        {doubledItems.map((item, index) => (
          <div key={index} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
