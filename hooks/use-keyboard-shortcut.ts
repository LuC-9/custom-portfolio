"use client"

import { useEffect } from "react"

type KeyboardShortcutOptions = {
  shiftKey?: boolean
  ctrlKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  enabled?: boolean
  preventDefault?: boolean
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"
}

/**
 * Runs a callback when the requested key combination is pressed outside typing fields.
 */
export function useKeyboardShortcut(
  key: string,
  onTrigger: () => void,
  options: KeyboardShortcutOptions = {},
) {
  useEffect(() => {
    if (options.enabled === false) return

    const handler = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return
      if (event.key.toLowerCase() !== key.toLowerCase()) return
      if (Boolean(options.shiftKey) !== event.shiftKey) return
      if (Boolean(options.ctrlKey) !== event.ctrlKey) return
      if (Boolean(options.altKey) !== event.altKey) return
      if (Boolean(options.metaKey) !== event.metaKey) return

      if (options.preventDefault !== false) {
        event.preventDefault()
      }
      onTrigger()
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [key, onTrigger, options.enabled, options.shiftKey, options.ctrlKey, options.altKey, options.metaKey, options.preventDefault])
}
