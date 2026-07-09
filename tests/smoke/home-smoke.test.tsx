import { render, screen } from "@testing-library/react"
import type React from "react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { HomeContent } from "@/app/HomeContent"
import { Navigation } from "@/components/navigation"
import { FocusToggle } from "@/components/game/focus-toggle"
import { useGame } from "@/contexts/game-context"

vi.mock("@/contexts/persona-context", () => ({
  usePersona: () => ({
    isDeveloper: true,
    isGamer: false,
    persona: "developer",
  }),
}))

vi.mock("@/contexts/game-context", () => ({
  useGame: vi.fn(),
}))

vi.mock("@/components/persona-toggle", () => ({
  PersonaToggle: () => <div data-testid="persona-toggle" />,
}))

vi.mock("@/components/discord-status", () => ({
  DiscordStatus: () => <div data-testid="discord-status" />,
}))

vi.mock("@/lib/game/event-bus", () => ({
  emitGameEvent: vi.fn(),
}))

vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}))

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}))

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

const useGameMock = vi.mocked(useGame)

describe("home smoke checks", () => {
  it("home content renders and resume link points to pdf", () => {
    render(<HomeContent />)

    expect(screen.getByRole("heading", { name: /Hi, I'm/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Resume" })).toHaveAttribute("href", "/resume.pdf")
  })

  it("navigation hides stats route", () => {
    render(<Navigation />)

    expect(screen.queryByRole("link", { name: "Stats" })).not.toBeInTheDocument()
  })

  it("focus mode toggle is interactive", async () => {
    const user = userEvent.setup()
    const toggleFocusMode = vi.fn()

    useGameMock.mockReturnValue({
      state: { focusMode: false },
      toggleFocusMode,
    } as never)

    render(<FocusToggle />)
    await user.click(screen.getByRole("button", { name: "Switch to focus mode" }))

    expect(toggleFocusMode).toHaveBeenCalledTimes(1)
  })
})
