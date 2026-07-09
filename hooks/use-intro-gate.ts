"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "portfolio:hero-intro:v1"

/**
 * Session-scoped gate for the hero cinematic. Returns `null` during hydration
 * so callers can render nothing on the server, then flips to `true` on first
 * visit and `false` for every subsequent navigation within the same tab.
 */
export function useIntroGate() {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const seen = window.sessionStorage.getItem(STORAGE_KEY) === "1"
      setShouldPlay(!seen)
    } catch {
      setShouldPlay(false)
    }
  }, [])

  const markPlayed = useCallback(() => {
    setShouldPlay(false)
    if (typeof window === "undefined") return
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // sessionStorage unavailable (private mode etc.) — silently ignore.
    }
  }, [])

  return { shouldPlay, markPlayed }
}
