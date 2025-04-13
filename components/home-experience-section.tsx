"use client"

import { usePersona } from "@/contexts/persona-context"
import { ExperienceSection } from "@/components/experience-section"

export function HomeExperienceSection({ 
  developerExperiences, 
  gamingExperiences 
}: { 
  developerExperiences: any[]
  gamingExperiences: any[]
}) {
  const { isDeveloper } = usePersona()
  
  // Select experiences based on current persona
  const experiences = isDeveloper ? developerExperiences : gamingExperiences
  
  return (
    <div className="container mx-auto px-4">
      <ExperienceSection 
        experiences={experiences} 
        isDeveloper={isDeveloper} 
      />
    </div>
  )
}

