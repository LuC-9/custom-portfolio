import { describe, expect, it } from "vitest"
import { TOTAL_QUEST_XP } from "@/lib/game/quests"
import { MAX_LEVEL, getLevelProgress, levelFromXp, xpForLevel } from "@/lib/game/xp"

describe("lib/game/xp", () => {
  it("returns expected xp thresholds for early levels", () => {
    expect(xpForLevel(1)).toBe(0)
    expect(xpForLevel(2)).toBe(100)
    expect(xpForLevel(3)).toBe(200)
  })

  it("derives level from total xp thresholds", () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(99)).toBe(1)
    expect(levelFromXp(100)).toBe(2)
    expect(levelFromXp(199)).toBe(2)
    expect(levelFromXp(200)).toBe(3)
    expect(levelFromXp(xpForLevel(7))).toBe(7)
  })

  it("caps level progression at max level", () => {
    const overCapXp = xpForLevel(MAX_LEVEL + 20)
    expect(levelFromXp(overCapXp)).toBe(MAX_LEVEL)
  })

  it("keeps total quest xp aligned to the max level cap", () => {
    expect(xpForLevel(MAX_LEVEL)).toBe(780)
    expect(TOTAL_QUEST_XP).toBe(780)
    expect(TOTAL_QUEST_XP).toBe(xpForLevel(MAX_LEVEL))
  })

  it("computes xp progress within current level", () => {
    const totalXp = xpForLevel(3) + 50
    const progress = getLevelProgress(totalXp)
    const requiredXpInLevel = xpForLevel(4) - xpForLevel(3)
    const expectedPercent = Math.round((50 / requiredXpInLevel) * 100)

    expect(progress.level).toBe(3)
    expect(progress.currentLevelXp).toBe(xpForLevel(3))
    expect(progress.nextLevelXp).toBe(xpForLevel(4))
    expect(progress.progressPercent).toBe(expectedPercent)
  })
})
