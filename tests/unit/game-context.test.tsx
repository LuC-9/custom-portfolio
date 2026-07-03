import { act, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it } from "vitest"
import { GameProvider, useGame } from "@/contexts/game-context"
import { emitGameEvent } from "@/lib/game/event-bus"
import { GAME_STORAGE_KEY } from "@/lib/game/storage"
import { xpForLevel } from "@/lib/game/xp"

function Probe() {
  const { className, completedCount, levelProgress, state, totalQuestCount } = useGame()
  return (
    <div>
      <span data-testid="class-name">{className}</span>
      <span data-testid="level">{levelProgress.level}</span>
      <span data-testid="xp">{state.totalXp}</span>
      <span data-testid="resume-download-count">{state.eventCounts.resume_download}</span>
      <span data-testid="page-visit-count">{state.eventCounts.page_visit}</span>
      <span data-testid="completed-count">{completedCount}</span>
      <span data-testid="total-quest-count">{totalQuestCount}</span>
    </div>
  )
}

function renderGameProvider() {
  return render(
    <GameProvider>
      <Probe />
    </GameProvider>,
  )
}

describe("contexts/game-context", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("hydrates legacy partial state with migration defaults", async () => {
    localStorage.setItem(
      GAME_STORAGE_KEY,
      JSON.stringify({
        totalXp: 75,
        eventCounts: { page_visit: 3 },
      }),
    )

    renderGameProvider()

    await waitFor(() => {
      expect(screen.getByTestId("xp")).toHaveTextContent("75")
    })

    expect(screen.getByTestId("resume-download-count")).toHaveTextContent("0")
  })

  it("awards XP once per task id and gives zero on repeats", async () => {
    renderGameProvider()

    act(() => {
      emitGameEvent({ type: "page_visit", taskId: "route:/" })
      emitGameEvent({ type: "page_visit", taskId: "route:/" })
      emitGameEvent({ type: "page_visit", taskId: "route:/" })
    })

    await waitFor(() => {
      expect(screen.getByTestId("page-visit-count")).toHaveTextContent("3")
    })

    expect(screen.getByTestId("xp")).toHaveTextContent("20")
    expect(screen.getByTestId("completed-count")).toHaveTextContent("1")
  })

  it("maps level ranges to class titles", async () => {
    localStorage.setItem(
      GAME_STORAGE_KEY,
      JSON.stringify({
        totalXp: xpForLevel(8),
      }),
    )

    renderGameProvider()

    await waitFor(() => {
      expect(screen.getByTestId("level")).toHaveTextContent("8")
    })
    expect(screen.getByTestId("class-name")).toHaveTextContent("Legendary Portfolio Master")
  })
})
