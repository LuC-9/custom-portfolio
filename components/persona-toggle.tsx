"use client"

import { usePersona } from "@/contexts/persona-context"
import { motion } from "motion/react"
import { emitGameEvent } from "@/lib/game/event-bus"
import { motionSpring, useReducedMotionSafe } from "@/hooks/use-reduced-motion"

export function PersonaToggle() {
  const { persona, setPersona } = usePersona()
  const reduceMotion = useReducedMotionSafe()

  const switchPersona = (nextPersona: "developer" | "gamer") => {
    if (persona === nextPersona) return

    emitGameEvent({
      type: "persona_switch",
      taskId: "persona:toggle",
      metadata: { to: nextPersona },
    })
    emitGameEvent({
      type: "persona_viewed",
      taskId: `persona:${nextPersona}`,
      metadata: { persona: nextPersona },
    })
    setPersona(nextPersona)
  }

  return (
    <div
      className="relative inline-flex rounded-full border border-border bg-card p-1"
      role="group"
      aria-label="Persona toggle"
    >
      <motion.div
        layout
        className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-primary"
        style={{ left: persona === "developer" ? "0.25rem" : "calc(50% + 0.25rem)" }}
        transition={reduceMotion ? { duration: 0 } : motionSpring}
      />
      <button
        type="button"
        role="button"
        aria-pressed={persona === "developer"}
        onClick={() => switchPersona("developer")}
        className={`relative z-10 min-w-[132px] rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
          persona === "developer" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        DEVELOPER
      </button>
      <button
        type="button"
        role="button"
        aria-pressed={persona === "gamer"}
        onClick={() => switchPersona("gamer")}
        className={`relative z-10 min-w-[132px] rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
          persona === "gamer" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        GAMER
      </button>
    </div>
  )
}
