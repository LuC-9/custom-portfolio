import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { PlayerHUD } from "@/components/game/player-hud"
import { useGame } from "@/contexts/game-context"
import { TOTAL_QUEST_COUNT } from "@/lib/game/quests"

vi.mock("@/contexts/game-context", () => ({
  useGame: vi.fn(),
}))

const useGameMock = vi.mocked(useGame)

describe("PlayerHUD", () => {
  it("renders level and exploration progress in normal mode", () => {
    useGameMock.mockReturnValue({
      state: {
        totalXp: 780,
        focusMode: false,
      },
      levelProgress: {
        level: 3,
        currentLevelXp: 640,
        nextLevelXp: 1320,
        progressPercent: 21,
      },
      className: "Senior Platform Ranger",
      completedCount: 14,
      totalQuestCount: TOTAL_QUEST_COUNT,
      toggleFocusMode: vi.fn(),
    } as never)

    render(<PlayerHUD />)

    expect(screen.getByText("Senior Platform Ranger")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
    expect(screen.getByText(`Explored 14/${TOTAL_QUEST_COUNT}`)).toBeInTheDocument()
    expect(screen.getByText("44% complete")).toBeInTheDocument()
  })

  it("stays hidden when focus mode is enabled", () => {
    useGameMock.mockReturnValue({
      state: {
        totalXp: 100,
        focusMode: true,
      },
      levelProgress: {
        level: 1,
        currentLevelXp: 0,
        nextLevelXp: 200,
        progressPercent: 50,
      },
      className: "Rookie Code Adventurer",
      completedCount: 0,
      totalQuestCount: TOTAL_QUEST_COUNT,
      toggleFocusMode: vi.fn(),
    } as never)

    const { container } = render(<PlayerHUD />)
    expect(container).toBeEmptyDOMElement()
  })
})
