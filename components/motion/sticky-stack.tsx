"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

gsap.registerPlugin(ScrollTrigger)

/**
 * Derived from design-taste-frontend Section 5.A Sticky-Stack.
 */
type StickyStackProps = {
  children: ReactNode[]
  className?: string
}

export function StickyStack({ children, className }: StickyStackProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()

  useEffect(() => {
    if (!rootRef.current || reduce || window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]")
      if (cards.length < 2) return

      cards.forEach((card, index) => {
        const nextCard = cards[index + 1]
        if (!nextCard) return

        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[cards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        })

        gsap.to(card, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduce])

  return (
    <div ref={rootRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          data-stack-card
          className={reduce ? "relative" : "sticky top-0 min-h-[100dvh] flex items-center"}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
