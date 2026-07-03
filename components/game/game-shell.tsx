"use client"

import dynamic from "next/dynamic"
import { FocusToggle } from "@/components/game/focus-toggle"
import { AchievementToast } from "@/components/game/achievement-toast"
import { LevelUpFlourish } from "@/components/game/level-up-flourish"

const PlayerHUD = dynamic(
  () => import("@/components/game/player-hud").then((mod) => ({ default: mod.PlayerHUD })),
  { ssr: false },
)

const FloatingHint = dynamic(
  () => import("@/components/game/floating-hint").then((mod) => ({ default: mod.FloatingHint })),
  { ssr: false },
)

/**
 * Mounts the client-only gamification surfaces used across the site shell.
 */
export function GameShell() {
  return (
    <>
      <FocusToggle />
      <PlayerHUD />
      <FloatingHint />
      <LevelUpFlourish />
      <AchievementToast />
    </>
  )
}
