"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react"
import { ACHIEVEMENTS } from "@/lib/game/achievements"
import { subscribeToGameEvents } from "@/lib/game/event-bus"
import { QUEST_BY_TASK_ID, TOTAL_QUEST_COUNT, TOTAL_QUEST_XP } from "@/lib/game/quests"
import {
  GAME_FOCUS_KEY,
  loadStoredFocusMode,
  loadStoredGameState,
  persistFocusMode,
  schedulePersistGameState,
} from "@/lib/game/storage"
import type {
  AchievementDefinition,
  GameEventPayload,
  GameEventType,
  GameState,
  GameStats,
} from "@/lib/game/types"
import { getLevelProgress } from "@/lib/game/xp"

const EVENT_TYPES: GameEventType[] = [
  "page_visit",
  "project_open",
  "blog_read",
  "resume_download",
  "persona_viewed",
  "experience_open",
  "chatbot_open",
  "chatbot_message",
  "link_click",
]

function createEmptyEventCounts(): Record<GameEventType, number> {
  return EVENT_TYPES.reduce<Record<GameEventType, number>>((acc, type) => {
    acc[type] = 0
    return acc
  }, {} as Record<GameEventType, number>)
}

const initialState: GameState = {
  totalXp: 0,
  unlockedAchievementIds: [],
  shownAchievementIds: [],
  eventCounts: createEmptyEventCounts(),
  completedTaskIds: [],
  eventHistory: [],
  focusMode: false,
  levelUpToLevel: null,
}

type GameAction =
  | { type: "HYDRATE"; payload: Partial<GameState> }
  | { type: "APPLY_EVENT"; payload: GameEventPayload }
  | { type: "TOGGLE_FOCUS_MODE" }
  | { type: "MARK_ACHIEVEMENT_SHOWN"; payload: string }
  | { type: "CLEAR_LEVEL_UP" }

function buildStats(state: GameState): GameStats {
  return {
    totalXp: state.totalXp,
    level: getLevelProgress(state.totalXp).level,
    eventCounts: state.eventCounts,
    achievementsUnlocked: state.unlockedAchievementIds.length,
    completedTaskIds: state.completedTaskIds,
    totalQuestCount: TOTAL_QUEST_COUNT,
  }
}

function normalizeTaskId(taskId?: string): string | null {
  if (!taskId) return null
  const normalized = taskId.trim().toLowerCase()
  return normalized.length > 0 ? normalized : null
}

function unlockNewAchievements(state: GameState): string[] {
  const stats = buildStats(state)
  return ACHIEVEMENTS.filter(
    (achievement) => !state.unlockedAchievementIds.includes(achievement.id) && achievement.condition(stats),
  ).map((achievement) => achievement.id)
}

function gameReducer(state: GameState, action: GameAction): GameState {
  if (action.type === "HYDRATE") {
    const normalizedCompletedTaskIds = Array.from(
      new Set((action.payload.completedTaskIds ?? state.completedTaskIds).map((taskId) => taskId.toLowerCase())),
    )
    return {
      ...state,
      ...action.payload,
      totalXp: Math.min(action.payload.totalXp ?? state.totalXp, TOTAL_QUEST_XP),
      eventCounts: {
        ...createEmptyEventCounts(),
        ...(action.payload.eventCounts ?? state.eventCounts),
      },
      completedTaskIds: normalizedCompletedTaskIds,
      focusMode: action.payload.focusMode ?? state.focusMode,
      levelUpToLevel: null,
    }
  }

  if (action.type === "APPLY_EVENT") {
    const eventType = action.payload.type
    const normalizedTaskId = normalizeTaskId(action.payload.taskId)
    const quest = normalizedTaskId ? QUEST_BY_TASK_ID.get(normalizedTaskId) : undefined
    const isQuestMatch = Boolean(quest && quest.eventType === eventType)
    const alreadyCompleted =
      Boolean(normalizedTaskId) &&
      state.completedTaskIds.some((taskId) => taskId.toLowerCase() === normalizedTaskId)
    const gainedXp = isQuestMatch && !alreadyCompleted ? quest!.xp : 0
    const nextEventCounts = {
      ...state.eventCounts,
      [eventType]: (state.eventCounts[eventType] ?? 0) + 1,
    }
    const nextCompletedTaskIds =
      isQuestMatch && !alreadyCompleted && normalizedTaskId
        ? [...state.completedTaskIds, normalizedTaskId]
        : state.completedTaskIds

    const oldLevel = getLevelProgress(state.totalXp).level
    const nextTotalXp = Math.min(state.totalXp + gainedXp, TOTAL_QUEST_XP)
    const newLevel = getLevelProgress(nextTotalXp).level
    const leveledUp = newLevel > oldLevel

    const nextState: GameState = {
      ...state,
      totalXp: nextTotalXp,
      eventCounts: nextEventCounts,
      completedTaskIds: nextCompletedTaskIds,
      eventHistory: [
        {
          type: eventType,
          at: Date.now(),
          ...(normalizedTaskId
            ? {
                metadata: {
                  ...(action.payload.metadata ?? {}),
                  taskId: normalizedTaskId,
                },
              }
            : { metadata: action.payload.metadata }),
        },
        ...state.eventHistory,
      ].slice(0, 50),
      levelUpToLevel: leveledUp ? newLevel : state.levelUpToLevel,
    }

    const newlyUnlocked = unlockNewAchievements(nextState)
    if (newlyUnlocked.length === 0) return nextState

    return {
      ...nextState,
      unlockedAchievementIds: [...nextState.unlockedAchievementIds, ...newlyUnlocked],
    }
  }

  if (action.type === "TOGGLE_FOCUS_MODE") {
    return {
      ...state,
      focusMode: !state.focusMode,
    }
  }

  if (action.type === "MARK_ACHIEVEMENT_SHOWN") {
    if (state.shownAchievementIds.includes(action.payload)) return state
    return {
      ...state,
      shownAchievementIds: [...state.shownAchievementIds, action.payload],
    }
  }

  if (action.type === "CLEAR_LEVEL_UP") {
    return {
      ...state,
      levelUpToLevel: null,
    }
  }

  return state
}

type GameContextValue = {
  state: GameState
  levelProgress: ReturnType<typeof getLevelProgress>
  className: string
  achievements: AchievementDefinition[]
  completedCount: number
  totalQuestCount: number
  toggleFocusMode: () => void
  markAchievementShown: (id: string) => void
  clearLevelUp: () => void
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

function getClassNameForLevel(level: number): string {
  if (level >= 8) return "Legendary Portfolio Master"
  if (level >= 6) return "Principal Experience Architect"
  if (level >= 4) return "Senior Systems Engineer"
  if (level >= 3) return "Platform Builder"
  if (level >= 2) return "Rising Explorer"
  return "Curious Visitor"
}

/**
 * Provides portfolio progression state and game actions to the app tree.
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    const storedState = loadStoredGameState()
    const focusFromDedicatedKey = loadStoredFocusMode()

    if (storedState || focusFromDedicatedKey || window.localStorage.getItem(GAME_FOCUS_KEY) !== null) {
      dispatch({
        type: "HYDRATE",
        payload: {
          ...storedState,
          completedTaskIds: (storedState?.completedTaskIds ?? []).map((taskId) => taskId.toLowerCase()),
          focusMode: focusFromDedicatedKey,
        },
      })
    }
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeToGameEvents((payload) => {
      dispatch({ type: "APPLY_EVENT", payload })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    schedulePersistGameState({
      totalXp: state.totalXp,
      unlockedAchievementIds: state.unlockedAchievementIds,
      shownAchievementIds: state.shownAchievementIds,
      eventCounts: state.eventCounts,
      completedTaskIds: state.completedTaskIds,
      eventHistory: state.eventHistory,
    })
  }, [
    state.totalXp,
    state.unlockedAchievementIds,
    state.shownAchievementIds,
    state.eventCounts,
    state.completedTaskIds,
    state.eventHistory,
  ])

  useEffect(() => {
    persistFocusMode(state.focusMode)
  }, [state.focusMode])

  const toggleFocusMode = useCallback(() => {
    dispatch({ type: "TOGGLE_FOCUS_MODE" })
  }, [])

  const markAchievementShown = useCallback((id: string) => {
    dispatch({ type: "MARK_ACHIEVEMENT_SHOWN", payload: id })
  }, [])

  const clearLevelUp = useCallback(() => {
    dispatch({ type: "CLEAR_LEVEL_UP" })
  }, [])

  const levelProgress = useMemo(() => getLevelProgress(state.totalXp), [state.totalXp])
  const className = useMemo(() => getClassNameForLevel(levelProgress.level), [levelProgress.level])
  const completedCount = state.completedTaskIds.length

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      levelProgress,
      className,
      achievements: ACHIEVEMENTS,
      completedCount,
      totalQuestCount: TOTAL_QUEST_COUNT,
      toggleFocusMode,
      markAchievementShown,
      clearLevelUp,
    }),
    [
      state,
      levelProgress,
      className,
      completedCount,
      toggleFocusMode,
      markAchievementShown,
      clearLevelUp,
    ],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

/**
 * Returns the current portfolio game context and enforces provider usage.
 */
export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGame must be used within GameProvider")
  }
  return context
}
