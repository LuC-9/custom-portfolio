import { render, screen } from "@testing-library/react"
import type React from "react"
import { describe, expect, it, vi } from "vitest"
import { LevelUpFlourish } from "@/components/game/level-up-flourish"
import { useGame } from "@/contexts/game-context"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

vi.mock("@/contexts/game-context", () => ({
  useGame: vi.fn(),
}))

vi.mock("@/hooks/use-reduced-motion", () => ({
  useReducedMotion: vi.fn(),
}))

vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.ComponentProps<"div"> & { initial?: unknown; transition?: unknown }) => (
      <div
        data-testid="flourish-motion"
        data-initial={JSON.stringify(props.initial ?? null)}
        data-transition={JSON.stringify(props.transition ?? null)}
      >
        {children}
      </div>
    ),
  },
}))

const useGameMock = vi.mocked(useGame)
const useReducedMotionMock = vi.mocked(useReducedMotion)

describe("LevelUpFlourish reduced-motion mode", () => {
  it("skips flourish motion variants when reduced motion is enabled", () => {
    useReducedMotionMock.mockReturnValue(true)
    useGameMock.mockReturnValue({
      state: {
        focusMode: false,
        levelUpToLevel: 5,
      },
      clearLevelUp: vi.fn(),
    } as never)

    render(<LevelUpFlourish />)

    expect(screen.getByText("Now Level 5")).toBeInTheDocument()
    const motionNode = screen.getByTestId("flourish-motion")
    expect(motionNode.getAttribute("data-initial")).toBe(JSON.stringify({ opacity: 0 }))
    expect(motionNode.getAttribute("data-transition")).toBe(JSON.stringify({ duration: 0.15 }))
  })
})
