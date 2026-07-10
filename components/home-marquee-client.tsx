"use client"

import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { usePersona } from "@/contexts/persona-context"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

type Direction = "forward" | "reverse"

type HomeMarqueeClientProps = {
  developerSkills: string[]
  gamerGames: string[]
  /**
   * Which way the strip animates. Two strips with opposite directions
   * (e.g. top + bottom of a picture frame) create a nice conveyor-belt
   * feel around the framed content.
   */
  direction?: Direction
  /**
   * When true, apply a horizontal fade mask at both edges so the strip
   * fades in/out instead of hard-clipping against the container. Off by
   * default because most consumers (like the hero image frame) already
   * clip via `overflow-hidden` on a bordered container.
   */
  fadeEdges?: boolean
  /** Extra classes on the outer wrapper, e.g. sizing / padding. */
  className?: string
}

const fadeMask: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
}

/**
 * Repeat the source list a few times so the half is comfortably wider
 * than the viewport with a compact gap between items. Previously we used
 * `justify-around` to spread the (short) list across the full viewport
 * width — that pushed the visible gap between skills to ~150-200px on
 * desktop, which looked airy and lost the "marquee rhythm". Packing the
 * list with `justify-start` + a small gap and duplicating the entries
 * keeps the rhythm tight while still giving the two halves enough
 * content to translate through without a visible seam.
 */
const HALF_REPEATS = 3

function MarqueeHalf({ skills }: { skills: string[] }) {
  const items =
    skills.length > 0 ? Array.from({ length: HALF_REPEATS }, () => skills).flat() : skills

  return (
    <div className="flex shrink-0 min-w-full items-center justify-start gap-6">
      {items.map((skill, index) => (
        <span key={`${skill}-${index}`} className="inline-flex shrink-0 items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground/70">·</span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{skill}</span>
        </span>
      ))}
    </div>
  )
}

export function HomeMarqueeClient({
  developerSkills,
  gamerGames,
  direction = "forward",
  fadeEdges = false,
  className,
}: HomeMarqueeClientProps) {
  const { isDeveloper } = usePersona()
  const reduceMotion = useReducedMotionSafe()
  const source = isDeveloper ? developerSkills : gamerGames
  const skills = source.length > 0 ? source : developerSkills

  return (
    <div
      className={cn("min-w-0 w-full overflow-hidden", className)}
      style={fadeEdges ? fadeMask : undefined}
    >
      <ul className="sr-only" aria-label="Tech stack">
        {skills.map((skill) => (
          <li key={`sr-${skill}`}>{skill}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="w-full overflow-hidden">
        {reduceMotion ? (
          <MarqueeHalf skills={skills} />
        ) : (
          // Two "halves" each pinned to at least viewport width via min-w-full.
          // Track uses w-max so it grows to the sum of both halves (2× viewport min);
          // CSS then animates by exactly -50% = one half's width → seamless loop.
          <div
            className={cn(
              "skills-marquee-track flex w-max",
              direction === "reverse" && "skills-marquee-track-reverse",
            )}
          >
            <MarqueeHalf skills={skills} />
            <MarqueeHalf skills={skills} />
          </div>
        )}
      </div>
    </div>
  )
}
