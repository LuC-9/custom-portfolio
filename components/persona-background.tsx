"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useState } from "react"

type PersonaBackgroundProps = {
  persona: "developer" | "gamer"
}

const PERSONA_GRADIENTS: Record<PersonaBackgroundProps["persona"], string> = {
  developer:
    "linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), radial-gradient(1200px 800px at 30% 20%, rgba(148, 163, 184, 0.2), transparent 70%), radial-gradient(1000px 700px at 78% 68%, rgba(96, 165, 250, 0.08), transparent 72%)",
  gamer:
    "linear-gradient(180deg, rgba(9, 9, 11, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%), radial-gradient(1200px 800px at 70% 30%, rgba(244, 63, 94, 0.18), transparent 70%), radial-gradient(900px 600px at 20% 80%, rgba(190, 24, 93, 0.12), transparent 65%), radial-gradient(circle at 50% 50%, transparent 44%, rgba(2, 6, 23, 0.56) 100%)",
}

export function PersonaBackground({ persona }: PersonaBackgroundProps) {
  const reduceMotion = useReducedMotion()
  const [reduceTransparency, setReduceTransparency] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia("(prefers-reduced-transparency: reduce)")
    const handleChange = () => setReduceTransparency(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)", opacity: 0 }}
      animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0 0)", opacity: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : {
              clipPath: "inset(0 0 0 100%)",
              opacity: 0,
              transition: {
                clipPath: { duration: 0.35, ease: "easeIn" },
                opacity: { duration: 0.2, ease: "easeIn" },
              },
            }
      }
      transition={
        reduceMotion
          ? { duration: 0.2 }
          : {
              clipPath: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }
      }
      style={
        reduceTransparency
          ? {
              backgroundImage: "",
              backgroundColor: "hsl(var(--background))",
            }
          : {
              backgroundImage: PERSONA_GRADIENTS[persona],
            }
      }
    />
  )
}
