"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { QUEST_CATALOG, type QuestDefinition } from "@/lib/game/quests"

type FloatingHintState = {
  order: string[]
  index: number
}

function shuffleTaskIds(taskIds: string[]): string[] {
  const shuffled = [...taskIds]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

/**
 * Rotates incomplete quest hints and reshuffles once each pass is exhausted.
 */
export function useFloatingHint(completedTaskIds: string[]) {
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

  const advanceHint = useCallback(() => {
    setState((previous) => {
      if (availableHintIds.length === 0) return { order: [], index: 0 }

      const normalizedOrder = previous.order.filter((taskId) => hintById.has(taskId))
      if (normalizedOrder.length === 0) {
        return {
          order: shuffleTaskIds(availableHintIds),
          index: 0,
        }
      }

      if (previous.index < normalizedOrder.length - 1) {
        return {
          order: normalizedOrder,
          index: previous.index + 1,
        }
      }

      return {
        order: shuffleTaskIds(availableHintIds),
        index: 0,
      }
    })
  }, [availableHintIds, hintById])

  useEffect(() => {
    if (availableHintIds.length === 0) return
    const timer = window.setInterval(() => {
      advanceHint()
    }, 8000)
    return () => window.clearInterval(timer)
  }, [advanceHint, availableHintIds.length])

  const currentHint: QuestDefinition | null = useMemo(() => {
    if (availableHintIds.length === 0) return null

    const normalizedOrder = state.order.filter((taskId) => hintById.has(taskId))
    const currentTaskId = normalizedOrder[state.index] ?? normalizedOrder[0] ?? availableHintIds[0]
    return hintById.get(currentTaskId) ?? null
  }, [availableHintIds, hintById, state.index, state.order])

  return {
    currentHint,
    dismissHint: advanceHint,
  }
}
