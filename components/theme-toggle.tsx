"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Use resolvedTheme to determine the actual theme (light or dark)
  // regardless of whether it's set manually or by system preference
  const isCurrentlyDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isCurrentlyDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="rounded-full w-9 h-9"
    >
      {isCurrentlyDark ? (
        <Sun size={18} className="rotate-0 scale-100 transition-all" />
      ) : (
        <Moon size={18} className="rotate-0 scale-100 transition-all" />
      )}
    </Button>
  )
}





