"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Persona = "developer" | "gamer"

type PersonaContextType = {
  persona: Persona
  togglePersona: () => void
  isDeveloper: boolean
  isGamer: boolean
  setPersona: (persona: Persona) => void
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined)

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>("developer")
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage on client side
  useEffect(() => {
    setMounted(true)
    const savedPersona = localStorage.getItem("persona") as Persona | null
    if (savedPersona && (savedPersona === "developer" || savedPersona === "gamer")) {
      setPersonaState(savedPersona)
    }
  }, [])

  const setPersona = (newPersona: Persona) => {
    setPersonaState(newPersona)
    localStorage.setItem("persona", newPersona)
  }

  const togglePersona = () => {
    const newPersona = persona === "developer" ? "gamer" : "developer"
    setPersona(newPersona)
  }

  // Keep persona cascade declarative via html[data-persona].
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute("data-persona", persona)
  }, [mounted, persona])

  return (
    <PersonaContext.Provider
      value={{
        persona,
        togglePersona,
        isDeveloper: persona === "developer",
        isGamer: persona === "gamer",
        setPersona,
      }}
    >
      {children}
    </PersonaContext.Provider>
  )
}

export function usePersona() {
  const context = useContext(PersonaContext)
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider")
  }
  return context
}

