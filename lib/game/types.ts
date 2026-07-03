"use client"

/**
 * User interactions that contribute to portfolio progression.
 */
export type GameEventType =
  | "page_visit"
  | "project_open"
  | "blog_read"
  | "resume_download"
  | "persona_viewed"
  | "experience_open"
  | "chatbot_open"
  | "chatbot_message"
  | "link_click"

/**
 * Rarity tiers used when rendering achievement unlock feedback.
 */
export type AchievementTier = "common" | "rare" | "legendary"

/**
 * Static metadata and unlock logic for a single achievement.
 */
export type AchievementDefinition = {
  id: string
  title: string
  description: string
  tier: AchievementTier
  icon: string
  condition: (stats: GameStats) => boolean
}

/**
 * Legacy shape for unlocked achievements with timestamps.
 */
export type UnlockedAchievement = {
  id: string
  unlockedAt: number
}

/**
 * Historical record of a tracked portfolio interaction.
 */
export type EventRecord = {
  type: GameEventType
  at: number
  metadata?: Record<string, string | number | boolean>
}

/**
 * Aggregated stats used by achievements and the stats page.
 */
export type GameStats = {
  totalXp: number
  level: number
  eventCounts: Record<GameEventType, number>
  achievementsUnlocked: number
  completedTaskIds: string[]
  totalQuestCount: number
}

/**
 * Persisted and in-memory state for the portfolio game layer.
 */
export type GameState = {
  totalXp: number
  unlockedAchievementIds: string[]
  shownAchievementIds: string[]
  eventCounts: Record<GameEventType, number>
  completedTaskIds: string[]
  eventHistory: EventRecord[]
  focusMode: boolean
  levelUpToLevel: number | null
}

/**
 * Event payload emitted by tracked portfolio interactions.
 */
export type GameEventPayload = {
  type: GameEventType
  taskId?: string
  metadata?: Record<string, string | number | boolean>
}
