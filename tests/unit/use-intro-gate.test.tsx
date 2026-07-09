import { act, renderHook, waitFor } from "@testing-library/react"
import { describe, expect, it, beforeEach } from "vitest"
import { useIntroGate } from "@/hooks/use-intro-gate"

const LEGACY_STORAGE_KEY = "portfolio:hero-intro:v1"

describe("useIntroGate", () => {
  beforeEach(() => {
    window.sessionStorage.clear()
  })

  it("plays on a fresh document even when a previous reload left the legacy session flag", async () => {
    window.sessionStorage.setItem(LEGACY_STORAGE_KEY, "1")

    const { result } = renderHook(() => useIntroGate())

    await waitFor(() => {
      expect(result.current.shouldPlay).toBe(true)
    })
  })

  it("hides the intro after it finishes in the current document", async () => {
    const { result } = renderHook(() => useIntroGate())

    await waitFor(() => {
      expect(result.current.shouldPlay).toBe(true)
    })

    act(() => {
      result.current.markPlayed()
    })

    expect(result.current.shouldPlay).toBe(false)
  })
})
