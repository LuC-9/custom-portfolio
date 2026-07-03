import type { GameState } from "@/lib/game/types"

/**
 * Local storage key for persisted portfolio progression data.
 */
export const GAME_STORAGE_KEY = "pf.game.v2"
const LEGACY_GAME_STORAGE_KEY = "pf.game.v1"

/**
 * Dedicated local storage key for the focus-mode toggle.
 */
export const GAME_FOCUS_KEY = "pf.game.focus"

type StoredGameState = Pick<
  GameState,
  | "totalXp"
  | "unlockedAchievementIds"
  | "shownAchievementIds"
  | "eventCounts"
  | "completedTaskIds"
  | "eventHistory"
>

type IdleCallbackHandle = number
type IdleCallback = (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void

declare global {
  interface Window {
    requestIdleCallback?: (cb: IdleCallback, opts?: { timeout: number }) => IdleCallbackHandle
    cancelIdleCallback?: (id: IdleCallbackHandle) => void
  }
}

/**
 * Loads the saved progression snapshot from local storage when available.
 */
export function loadStoredGameState(): Partial<StoredGameState> | null {
  if (typeof window === "undefined") return null
  try {
    const rawV2 = window.localStorage.getItem(GAME_STORAGE_KEY)
    if (rawV2) {
      return JSON.parse(rawV2) as StoredGameState
    }

    const rawLegacy = window.localStorage.getItem(LEGACY_GAME_STORAGE_KEY)
    if (!rawLegacy) return null

    const legacyState = JSON.parse(rawLegacy) as Partial<StoredGameState>
    const migratedState: Partial<StoredGameState> = {
      ...legacyState,
      completedTaskIds: legacyState.completedTaskIds ?? [],
    }

    window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(migratedState))
    window.localStorage.removeItem(LEGACY_GAME_STORAGE_KEY)
    return migratedState
  } catch {
    return null
  }
}

/**
 * Reads the current focus-mode preference from local storage.
 */
export function loadStoredFocusMode(): boolean {
  if (typeof window === "undefined") return false
  return window.localStorage.getItem(GAME_FOCUS_KEY) === "1"
}

/**
 * Persists the focus-mode preference independently from the main game state.
 */
export function persistFocusMode(enabled: boolean) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(GAME_FOCUS_KEY, enabled ? "1" : "0")
}

let pendingWrite: IdleCallbackHandle | null = null

/**
 * Queues a save for progression state without blocking the current interaction.
 */
export function schedulePersistGameState(state: StoredGameState) {
  if (typeof window === "undefined") return

  if (pendingWrite !== null) {
    if (window.cancelIdleCallback) {
      window.cancelIdleCallback(pendingWrite)
    } else {
      window.clearTimeout(pendingWrite)
    }
  }

  const writeNow = () => {
    window.localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(state))
    pendingWrite = null
  }

  if (window.requestIdleCallback) {
    pendingWrite = window.requestIdleCallback(writeNow, { timeout: 800 })
    return
  }

  pendingWrite = window.setTimeout(writeNow, 120)
}
