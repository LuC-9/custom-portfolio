"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

/**
 * Derived from design-taste-frontend Section 5.B Horizontal-Pan.
 */
type HorizontalPanProps = {
  children: ReactNode
  className?: string
}

export function HorizontalPan({ children, className }: HorizontalPanProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()

  useEffect(() => {
    if (!wrapperRef.current || !trackRef.current || reduce) return

    const ctx = gsap.context(() => {
      const distance = Math.max(trackRef.current!.scrollWidth - window.innerWidth, 0)
      if (distance <= 0) return

      gsap.to(trackRef.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [reduce])

  if (reduce) {
    return (
      <section className={`overflow-x-auto snap-x snap-mandatory ${className ?? ""}`}>
        <div className="flex min-h-[100dvh] items-center">{children}</div>
      </section>
    )
  }

  return (
    <section ref={wrapperRef} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={trackRef} className="flex min-h-[100dvh] items-center">
        {children}
      </div>
    </section>
  )
}
