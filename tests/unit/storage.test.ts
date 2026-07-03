import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  GAME_FOCUS_KEY,
  GAME_STORAGE_KEY,
  loadStoredFocusMode,
  loadStoredGameState,
  persistFocusMode,
  schedulePersistGameState,
} from "@/lib/game/storage"

const gameStateFixture = {
  totalXp: 250,
  unlockedAchievementIds: ["welcome_adventurer"],
  shownAchievementIds: [],
  eventCounts: {
    page_visit: 1,
    project_open: 0,
    blog_read: 0,
    resume_download: 0,
    persona_viewed: 0,
    experience_open: 0,
    chatbot_open: 0,
    chatbot_message: 0,
    link_click: 0,
  },
  completedTaskIds: [],
  eventHistory: [],
}

describe("lib/game/storage", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    delete window.requestIdleCallback
    delete window.cancelIdleCallback
  })

  it("loads persisted game state and handles malformed values", () => {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameStateFixture))
    expect(loadStoredGameState()).toMatchObject({ totalXp: 250 })

    localStorage.setItem(GAME_STORAGE_KEY, "{invalid")
    expect(loadStoredGameState()).toBeNull()
  })

  it("migrates legacy v1 storage to v2 key", () => {
    localStorage.setItem("pf.game.v1", JSON.stringify(gameStateFixture))

    const loaded = loadStoredGameState()

    expect(loaded).toMatchObject({ totalXp: 250, completedTaskIds: [] })
    expect(localStorage.getItem(GAME_STORAGE_KEY)).not.toBeNull()
    expect(localStorage.getItem("pf.game.v1")).toBeNull()
  })

  it("persists and reads focus mode", () => {
    persistFocusMode(true)
    expect(localStorage.getItem(GAME_FOCUS_KEY)).toBe("1")
    expect(loadStoredFocusMode()).toBe(true)

    persistFocusMode(false)
    expect(loadStoredFocusMode()).toBe(false)
  })

  it("coalesces scheduled writes and persists latest state", () => {
    schedulePersistGameState({ ...gameStateFixture, totalXp: 100 })
    schedulePersistGameState({ ...gameStateFixture, totalXp: 200 })
    vi.advanceTimersByTime(120)

    const stored = JSON.parse(localStorage.getItem(GAME_STORAGE_KEY) ?? "{}")
    expect(stored.totalXp).toBe(200)
  })
})
