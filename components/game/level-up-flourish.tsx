"use client"

import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useGame } from "@/contexts/game-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

/**
 * Displays a transient level-up banner that respects reduced-motion preferences.
 */
export function LevelUpFlourish() {
  const { state, clearLevelUp } = useGame()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!state.levelUpToLevel) return
    const timer = window.setTimeout(() => clearLevelUp(), prefersReducedMotion ? 800 : 1800)
    return () => window.clearTimeout(timer)
  }, [state.levelUpToLevel, clearLevelUp, prefersReducedMotion])

  if (state.focusMode) return null

  return (
    <AnimatePresence>
      {state.levelUpToLevel ? (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 1.02 }}
          transition={{ duration: prefersReducedMotion ? 0.15 : 0.4 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          aria-live="polite"
        >
          <div className="experience-card px-5 py-3 bg-background/90 backdrop-blur-md">
            <p className="text-xs uppercase tracking-wide font-mono text-muted-foreground">Level Up</p>
            <p className="text-lg font-semibold font-mono">Now Level {state.levelUpToLevel}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
