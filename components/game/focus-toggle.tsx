"use client"

import { Eye, Gamepad2 } from "lucide-react"
import { useGame } from "@/contexts/game-context"
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut"
import { Button } from "@/components/ui/button"

/**
 * Toggles between full game HUD mode and clean focus mode.
 */
export function FocusToggle() {
  const { state, toggleFocusMode } = useGame()
  useKeyboardShortcut("g", toggleFocusMode)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleFocusMode}
      className="fixed right-4 top-20 z-40 rounded-full border-border/60 bg-card/70 px-4 font-mono shadow-kinetic backdrop-blur focus-visible:ring-2 focus-visible:ring-primary"
      aria-pressed={state.focusMode}
      aria-label={state.focusMode ? "Switch to game mode" : "Switch to focus mode"}
    >
      {state.focusMode ? (
        <>
          <Eye className="h-4 w-4 mr-2" />
          
        </>
      ) : (
        <>
          <Gamepad2 className="h-4 w-4 mr-2" />
          
        </>
      )}
      <span className="ml-2 text-[10px] text-muted-foreground">G</span>
    </Button>
  )
}
