import type { GameEventPayload } from "@/lib/game/types"

type GameEventListener = (payload: GameEventPayload) => void

class GameEventBus {
  private listeners = new Set<GameEventListener>()

  subscribe(listener: GameEventListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  emit(payload: GameEventPayload) {
    this.listeners.forEach((listener) => listener(payload))
  }
}

const gameEventBus = new GameEventBus()

/**
 * Broadcasts a tracked portfolio event to the game state provider.
 */
export function emitGameEvent(payload: GameEventPayload) {
  gameEventBus.emit(payload)
}

/**
 * Registers a listener for portfolio game events and returns an unsubscribe callback.
 */
export function subscribeToGameEvents(listener: GameEventListener) {
  return gameEventBus.subscribe(listener)
}
