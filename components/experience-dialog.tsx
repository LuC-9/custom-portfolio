"use client"

import { useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Building } from "lucide-react"
import { emitGameEvent } from "@/lib/game/event-bus"

interface ExperienceProps {
  id: string
  title: string
  company?: string
  team?: string
  platform?: string
  community?: string
  period: string
  contentHtml: string
  skills?: string[]
}

export function ExperienceDialog({ 
  experience, 
  children, 
  isDeveloper 
}: { 
  experience: ExperienceProps
  children: ReactNode
  isDeveloper: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    emitGameEvent({
      type: "experience_open",
      taskId: `experience:${experience.id}`.toLowerCase(),
      metadata: {
        experienceId: experience.id,
        experienceTitle: experience.title,
      },
    })
    setIsOpen(true)
  }
  
  return (
    <>
      <div onClick={handleOpen}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-4xl rounded-xl border-border/60 bg-popover shadow-kinetic">
          <DialogHeader className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <DialogTitle className="text-xl sm:text-2xl break-words">{experience.title}</DialogTitle>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{isDeveloper ? experience.company : experience.team || experience.platform || experience.community || "Gaming Organization"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{experience.period}</span>
              </div>
            </div>
            
            {/* Skills Section */}
            {experience.skills && experience.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {experience.skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="rounded-full border border-border/60 bg-card/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto rounded-xl border border-border/50 bg-card/50 p-4">
            <div
              className="prose prose-sm lg:prose-base dark:prose-invert max-w-none text-sm break-words"
              dangerouslySetInnerHTML={{ __html: experience.contentHtml }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
