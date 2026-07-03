import { describe, expect, it } from "vitest"
import { ACHIEVEMENTS } from "@/lib/game/achievements"
import type { GameEventType, GameStats } from "@/lib/game/types"
import { QUEST_CATALOG, TOTAL_QUEST_COUNT } from "@/lib/game/quests"

function makeStats(overrides: Partial<GameStats> = {}): GameStats {
  const counts = {
    page_visit: 0,
    project_open: 0,
    blog_read: 0,
    resume_download: 0,
    persona_viewed: 0,
    experience_open: 0,
    chatbot_open: 0,
    chatbot_message: 0,
    link_click: 0,
  } satisfies Record<GameEventType, number>

  return {
    totalXp: 0,
    level: 1,
    eventCounts: counts,
    achievementsUnlocked: 0,
    completedTaskIds: [],
    totalQuestCount: TOTAL_QUEST_COUNT,
    ...overrides,
  }
}

function unlockedIds(stats: GameStats): string[] {
  return ACHIEVEMENTS.filter((item) => item.condition(stats)).map((item) => item.id)
}

describe("lib/game/achievements", () => {
  it("unlocks route and project achievements from completed tasks", () => {
    const ids = unlockedIds(
      makeStats({
        completedTaskIds: [
          "route:/",
          "route:/projects",
          "route:/blog",
          "route:/community",
          "route:/contact",
          "project:arduino-cli-docker",
          "project:customizable-portfolio",
          "project:merchant-management",
        ],
      }),
    )

    expect(ids).toContain("first_step")
    expect(ids).toContain("route_runner")
    expect(ids).toContain("project_binge")
  })

  it("unlocks level-based achievements only at required levels", () => {
    const levelFour = unlockedIds(makeStats({ level: 4 }))
    const levelEight = unlockedIds(makeStats({ level: 8 }))

    expect(levelFour).not.toContain("level_5")
    expect(levelEight).toContain("level_5")
    expect(levelEight).toContain("level_8")
  })

  it("unlocks resume and persona achievements from completed tasks", () => {
    const ids = unlockedIds(
      makeStats({
        completedTaskIds: ["resume:download", "persona:developer", "persona:gamer"],
      }),
    )

    expect(ids).toContain("resume_scout")
    expect(ids).toContain("dual_persona")
  })

  it("unlocks milestone achievements from completed task prefixes", () => {
    const ids = unlockedIds(
      makeStats({
        completedTaskIds: QUEST_CATALOG.map((quest) => quest.taskId),
      }),
    )

    expect(ids).toContain("blog_reader")
    expect(ids).toContain("experience_tourer")
    expect(ids).toContain("network_navigator")
    expect(ids).toContain("portfolio_completionist")
  })
})
