"use client"

import { X, Sparkles } from "lucide-react"
import { useGame } from "@/contexts/game-context"
import { Button } from "@/components/ui/button"

/**
 * Shows the visitor's current level, exploration progress, and HUD toggle controls.
 */
export function PlayerHUD() {
  const { state, levelProgress, className, completedCount, totalQuestCount, toggleFocusMode } = useGame()
  const { level } = levelProgress
  const exploredPercent = Math.round((completedCount / Math.max(totalQuestCount, 1)) * 100)

  if (state.focusMode) return null

  return (
    <section
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-40 rounded-xl border border-border/60 bg-card/90 p-4 shadow-kinetic backdrop-blur md:bottom-6 md:left-auto md:right-6 md:w-[min(360px,40vw)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Class</p>
          <p className="font-mono text-sm text-foreground">{className}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFocusMode}
          className="h-7 w-7 rounded-full border border-border/60 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Switch to focus mode"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Lvl</p>
        <p className="flex items-center gap-1 font-mono text-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          {level}
        </p>
      </div>

      <div className="mt-2">
        <div className="h-2 w-full rounded-full bg-secondary/50 overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-500 ease-out"
            style={{ width: `${exploredPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>Explored {completedCount}/{totalQuestCount}</span>
        <span>{exploredPercent}% complete</span>
      </div>
    </section>
  )
}
