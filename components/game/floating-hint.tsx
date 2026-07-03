"use client"

import { Route, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"
import { useFloatingHint } from "@/hooks/use-floating-hint"

function routeFromTaskId(taskId: string): string | null {
  if (!taskId.startsWith("route:")) return null
  return taskId.slice("route:".length) || "/"
}

/**
 * Shows a single rotating hint pill while game mode is active.
 */
export function FloatingHint() {
  const router = useRouter()
  const { state } = useGame()
  const { currentHint, dismissHint } = useFloatingHint(state.completedTaskIds)

  if (state.focusMode || !currentHint) return null

  const route = routeFromTaskId(currentHint.taskId)

  return (
    <section aria-live="polite" className="fixed bottom-28 left-4 z-40">
      <div className="experience-card flex items-center gap-2 rounded-full px-2 py-1 shadow-lg backdrop-blur-sm">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => {
            if (route) {
              router.push(route)
              return
            }
            dismissHint()
          }}
          className="h-auto rounded-full px-3 py-1 text-xs font-mono leading-snug"
          aria-label={
            route ? `Navigate to complete hint: ${currentHint.label}` : `Hint: ${currentHint.label}`
          }
        >
          {route && <Route className="mr-1 h-3 w-3 shrink-0" aria-hidden="true" />}
          {currentHint.label}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={dismissHint}
          className="h-7 w-7 rounded-full"
          aria-label="Dismiss hint"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </section>
  )
}
