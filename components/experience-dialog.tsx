"use client"

import { useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Building } from "lucide-react"

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
  
  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl w-[95vw] sm:w-auto overflow-hidden flex flex-col">
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
                  <Badge key={i} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-2 -mr-2">
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
