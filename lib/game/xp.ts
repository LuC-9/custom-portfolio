/**
 * Hard cap used by the portfolio progression system.
 */
export const MAX_LEVEL = 8
const XP_THRESHOLDS_BY_LEVEL = [0, 100, 200, 320, 440, 560, 680, 780] as const

/**
 * Returns the cumulative XP required to reach a level.
 */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0
  const clamped = Math.min(level, MAX_LEVEL)
  return XP_THRESHOLDS_BY_LEVEL[clamped - 1]
}

/**
 * Resolves the current level from the accumulated XP total.
 */
export function levelFromXp(totalXp: number): number {
  if (totalXp <= 0) return 1

  let level = 1
  while (level < MAX_LEVEL && xpForLevel(level + 1) <= Math.max(totalXp, 0)) {
    level += 1
  }
  return level
}

/**
 * Builds the level badge, thresholds, and percent progress for UI displays.
 */
export function getLevelProgress(totalXp: number): {
  level: number
  currentLevelXp: number
  nextLevelXp: number
  progressPercent: number
} {
  const clampedTotalXp = Math.min(Math.max(totalXp, 0), xpForLevel(MAX_LEVEL))
  const level = levelFromXp(clampedTotalXp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(Math.min(level + 1, MAX_LEVEL))
  const required = Math.max(nextLevelXp - currentLevelXp, 1)
  const earnedInLevel = Math.max(clampedTotalXp - currentLevelXp, 0)
  const progressPercent = level >= MAX_LEVEL ? 100 : Math.min(100, Math.round((earnedInLevel / required) * 100))

  return {
    level,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
  }
}
