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
      className="fixed top-20 right-4 z-40 bg-secondary/20 border-secondary/50 font-mono focus-visible:ring-2 focus-visible:ring-primary"
      aria-pressed={state.focusMode}
      aria-label={state.focusMode ? "Switch to game mode" : "Switch to focus mode"}
    >
      {state.focusMode ? (
        <>
          <Eye className="h-4 w-4 mr-2" />
          Focus
        </>
      ) : (
        <>
          <Gamepad2 className="h-4 w-4 mr-2" />
          Game On
        </>
      )}
      <span className="ml-2 text-[10px] text-muted-foreground">G</span>
    </Button>
  )
}
