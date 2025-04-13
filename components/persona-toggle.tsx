"use client"

import { usePersona } from "@/contexts/persona-context"
import { motion } from "framer-motion"

export function PersonaToggle() {
  const { persona, togglePersona } = usePersona()

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${persona === "developer" ? "text-primary" : "text-muted-foreground"}`}>
        Developer
      </span>

      <button
        onClick={togglePersona}
        className="relative h-6 w-12 rounded-full bg-secondary p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        aria-label={`Switch to ${persona === "developer" ? "gamer" : "developer"} mode`}
      >
        <motion.div
          className="h-4 w-4 rounded-full bg-primary"
          animate={{ x: persona === "developer" ? 0 : 24 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>

      <span className={`text-sm font-medium ${persona === "gamer" ? "text-primary" : "text-muted-foreground"}`}>
        Gamer
      </span>
    </div>
  )
}
