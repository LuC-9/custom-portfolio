"use client"

import { useEffect, useMemo } from "react"
import { toast } from "sonner"
import { Crown, Medal, ShieldCheck } from "lucide-react"
import { useGame } from "@/contexts/game-context"
import type { AchievementTier } from "@/lib/game/types"

function tierStyles(tier: AchievementTier) {
  if (tier === "legendary") {
    return {
      label: "Legendary",
      icon: Crown,
      className: "border-yellow-400/50 bg-yellow-500/10",
    }
  }
  if (tier === "rare") {
    return {
      label: "Rare",
      icon: Medal,
      className: "border-purple-400/50 bg-purple-500/10",
    }
  }
  return {
    label: "Common",
    icon: ShieldCheck,
    className: "border-primary/40 bg-secondary/30",
  }
}

/**
 * Announces newly unlocked achievements with tier-aware toast styling.
 */
export function AchievementToast() {
  const { state, achievements, markAchievementShown } = useGame()

  const pending = useMemo(
    () =>
      state.unlockedAchievementIds.find((id) => {
        return !state.shownAchievementIds.includes(id)
      }),
    [state.unlockedAchievementIds, state.shownAchievementIds],
  )

  useEffect(() => {
    if (state.focusMode || !pending) return

    const achievement = achievements.find((item) => item.id === pending)
    if (!achievement) return

    const tier = tierStyles(achievement.tier)
    const TierIcon = tier.icon

    toast.custom(
      () => (
        <div
          className={`w-[min(90vw,360px)] rounded-lg border p-4 shadow-lg ${tier.className}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-full p-2 bg-background/60">
              <TierIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide font-mono text-muted-foreground">{tier.label} Achievement</p>
              <p className="font-semibold leading-tight">{achievement.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
            </div>
          </div>
        </div>
      ),
      {
        duration: 3800,
      },
    )

    markAchievementShown(pending)
  }, [pending, achievements, markAchievementShown, state.focusMode])

  return null
}
