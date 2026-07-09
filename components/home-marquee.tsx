"use client"

import { useMemo } from "react"
import { KineticMarquee } from "@/components/motion/kinetic-marquee"
import { usePersona } from "@/contexts/persona-context"

const developerItems = ["REACT", "TYPESCRIPT", "NEXT.JS", "KUBERNETES", "GO", "JAVA", "DOCKER", "POSTGRES", "NODE.JS"]
const gamerItems = ["VALORANT", "APEX LEGENDS", "CS2", "DOTA 2", "LIVE ON TWITCH", "COMMUNITY FIRST", "STRATEGY"]

export function HomeMarquee() {
  const { isDeveloper } = usePersona()

  const items = useMemo(() => {
    const source = isDeveloper ? developerItems : gamerItems
    return source.map((item, index) => (
      <span key={item} className="inline-flex items-center gap-4">
        <span className="font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">{item}</span>
        {index < source.length - 1 ? <span className="font-mono text-sm text-muted-foreground">·</span> : null}
      </span>
    ))
  }, [isDeveloper])

  return (
    <section className="w-full border-y border-border/60 bg-card/40 py-4">
      <KineticMarquee items={items} speedSec={40} />
    </section>
  )
}
