"use client"

import { type CSSProperties, type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

/**
 * Derived from design-taste-frontend Section 5.D Spotlight Border Card.
 */
type SpotlightBorderProps = {
  children: ReactNode
  className?: string
  size?: number
}

export function SpotlightBorder({ children, className, size = 220 }: SpotlightBorderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotionSafe()
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)")
    const update = () => setIsCoarsePointer(!mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || isCoarsePointer || event.pointerType !== "mouse" || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    containerRef.current.style.setProperty("--mouse-x", `${x}px`)
    containerRef.current.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`spotlight-border relative rounded-xl border border-border ${reduce || isCoarsePointer ? "spotlight-static" : ""} ${className ?? ""}`}
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
          "--spot-size": `${size}px`,
        } as CSSProperties
      }
    >
      <div className="relative">{children}</div>
    </div>
  )
}
