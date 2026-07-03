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
      className="fixed bottom-4 right-4 z-40 w-[min(92vw,360px)] experience-card p-4 shadow-lg backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground font-mono">Class</p>
          <p className="text-sm font-semibold">{className}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFocusMode}
          className="h-7 w-7 focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Switch to focus mode"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-mono">Lvl</p>
        <p className="text-lg font-semibold font-mono flex items-center gap-1">
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

      <div className="mt-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
        <span>Explored {completedCount}/{totalQuestCount}</span>
        <span>{exploredPercent}% complete</span>
      </div>
    </section>
  )
}
