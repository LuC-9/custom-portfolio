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

  // Initialize from localStorage on client side
  useEffect(() => {
    const savedPersona = localStorage.getItem("persona") as Persona | null
    if (savedPersona && (savedPersona === "developer" || savedPersona === "gamer")) {
      setPersonaState(savedPersona)
    }
  }, [])

  const setPersona = (newPersona: Persona) => {
    setPersonaState(newPersona)
    localStorage.setItem("persona", newPersona)
    
    // Update document colors based on persona
    if (newPersona === "developer") {
      document.documentElement.style.setProperty("--primary", "210 80% 75%") // Pastel blue for developer
      document.documentElement.classList.remove("gamer-theme")
    }
  }

  const togglePersona = () => {
    const newPersona = persona === "developer" ? "gamer" : "developer"
    setPersona(newPersona)
  }

  // Initialize theme on first load
  useEffect(() => {
    if (persona === "developer") {
      document.documentElement.style.setProperty("--primary", "210 80% 75%") // Pastel blue
      document.documentElement.classList.remove("gamer-theme")
    } else {
      document.documentElement.style.setProperty("--primary", "0 80% 80%") // Pastel red
      document.documentElement.classList.add("gamer-theme")
    }
  }, [persona])

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

