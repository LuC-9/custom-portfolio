"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { QUEST_CATALOG } from "@/lib/game/quests"

type FloatingHintState = {
  order: string[]
  index: number
}

export type HintItem = {
  id: string
  label: string
  route: string | null
  icon: "route" | "sparkle"
}

function shuffleTaskIds(taskIds: string[]): string[] {
  const shuffled = [...taskIds]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function toHintItem(taskId: string, label: string): HintItem {
  const route = taskId.startsWith("route:") ? taskId.slice("route:".length) : null
  return {
    id: taskId,
    label,
    route,
    icon: route !== null ? "route" : "sparkle",
  }
}

/**
 * Rotates incomplete quest hints and reshuffles once each pass is exhausted.
 */
export function useFloatingHints(
  completedTaskIds: string[],
  options?: { max?: number },
): {
  hints: HintItem[]
  dismissHint: (id: string) => void
} {
  const completedTaskSet = useMemo(
    () => new Set(completedTaskIds.map((taskId) => taskId.toLowerCase())),
    [completedTaskIds],
  )

  const availableHints = useMemo(
    () =>
      QUEST_CATALOG.filter((quest) => {
        return !completedTaskSet.has(quest.taskId.toLowerCase())
      }),
    [completedTaskSet],
  )

  const availableHintIds = useMemo(() => availableHints.map((quest) => quest.taskId), [availableHints])
  const hintById = useMemo(
    () => new Map(availableHints.map((quest) => [quest.taskId, quest] as const)),
    [availableHints],
  )
  const availableKey = useMemo(() => availableHintIds.join("|"), [availableHintIds])

  const [state, setState] = useState<FloatingHintState>({ order: [], index: 0 })

  useEffect(() => {
    if (availableHintIds.length === 0) {
      setState({ order: [], index: 0 })
      return
    }
    setState({
      order: shuffleTaskIds(availableHintIds),
      index: 0,
    })
  }, [availableKey, availableHintIds])

  const dismissHint = useCallback((id: string) => {
    setState((previous) => {
      if (availableHintIds.length === 0) return { order: [], index: 0 }

      const normalizedOrder = previous.order.filter((taskId) => hintById.has(taskId))
      if (normalizedOrder.length === 0) {
        return {
          order: shuffleTaskIds(availableHintIds),
          index: 0,
        }
      }

      const dismissedIndex = normalizedOrder.indexOf(id)
      if (dismissedIndex === -1) {
        return {
          order: normalizedOrder,
          index: previous.index % normalizedOrder.length,
        }
      }

      if (dismissedIndex < normalizedOrder.length - 1) {
        return { order: normalizedOrder, index: dismissedIndex + 1 }
      }

      return { order: shuffleTaskIds(availableHintIds), index: 0 }
    })
  }, [availableHintIds, hintById])

  const maxHints = Math.max(1, options?.max ?? 3)

  const hints = useMemo(() => {
    if (availableHintIds.length === 0) return []

    const normalizedOrder = state.order.filter((taskId) => hintById.has(taskId))
    const currentOrder = normalizedOrder.length > 0 ? normalizedOrder : availableHintIds
    if (currentOrder.length === 0) return []

    const startIndex = state.index % currentOrder.length
    const count = Math.min(maxHints, currentOrder.length)

    return Array.from({ length: count }, (_, offset) => {
      const index = (startIndex + offset) % currentOrder.length
      const taskId = currentOrder[index]
      const quest = hintById.get(taskId)
      if (!quest) return null
      return toHintItem(quest.taskId, quest.label)
    }).filter((hint): hint is HintItem => hint !== null)
  }, [availableHintIds, hintById, maxHints, state.index, state.order])

  return {
    hints,
    dismissHint,
  }
}

export function useFloatingHint(completedTaskIds: string[]) {
  const { hints, dismissHint } = useFloatingHints(completedTaskIds, { max: 1 })
  const currentHint = hints[0] ?? null

  const dismissCurrentHint = useCallback(() => {
    if (!currentHint) return
    dismissHint(currentHint.id)
  }, [currentHint, dismissHint])

  return {
    currentHint,
    dismissHint: dismissCurrentHint,
  }
}
