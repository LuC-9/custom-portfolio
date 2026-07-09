"use client"

import type { CSSProperties } from "react"
import { usePersona } from "@/contexts/persona-context"
import { useReducedMotionSafe } from "@/hooks/use-reduced-motion"

type HomeMarqueeClientProps = {
  developerSkills: string[]
  gamerGames: string[]
}

const fadeMask: CSSProperties = {
  WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
  maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
}

function MarqueeHalf({ skills }: { skills: string[] }) {
  return (
    <div className="flex shrink-0 min-w-full items-center justify-around">
      {skills.map((skill, index) => (
        <span key={`${skill}-${index}`} className="inline-flex shrink-0 items-center gap-4 px-3">
          <span className="font-mono text-sm text-muted-foreground">·</span>
          <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">{skill}</span>
        </span>
      ))}
    </div>
  )
}

export function HomeMarqueeClient({ developerSkills, gamerGames }: HomeMarqueeClientProps) {
  const { isDeveloper } = usePersona()
  const reduceMotion = useReducedMotionSafe()
  const source = isDeveloper ? developerSkills : gamerGames
  const skills = source.length > 0 ? source : developerSkills

  return (
    <div className="min-w-0 w-full overflow-hidden" style={fadeMask}>
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
          <div className="skills-marquee-track flex w-max">
            <MarqueeHalf skills={skills} />
            <MarqueeHalf skills={skills} />
          </div>
        )}
      </div>
    </div>
  )
}
