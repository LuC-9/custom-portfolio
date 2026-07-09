"use client"

import { useCallback, useEffect, useState } from "react"

const SKIP_STORAGE_KEY = "portfolio:hero-intro:skip:v1"

let playedInCurrentDocument = false

/**
 * Document-scoped gate for the hero cinematic. Returns `null` during hydration
 * so callers can render nothing on the server, then flips to `true` for each
 * full document load/reload and `false` after the intro plays in that document.
 */
export function useIntroGate() {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      if (window.sessionStorage.getItem(SKIP_STORAGE_KEY) === "1") {
        setShouldPlay(false)
        return
      }
    } catch {
      // sessionStorage unavailable (private mode etc.) — continue normally.
    }
    setShouldPlay(!playedInCurrentDocument)
  }, [])

  const markPlayed = useCallback(() => {
    playedInCurrentDocument = true
    setShouldPlay(false)
  }, [])

  return { shouldPlay, markPlayed }
}
