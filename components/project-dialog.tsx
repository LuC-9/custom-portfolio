import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Tag } from "lucide-react"

interface ProjectProps {
  id: string
  title: string
  description: string
  content: string
  contentHtml: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export function ProjectDialog({ project, children }: { project: ProjectProps; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-auto overflow-hidden flex flex-col">
          {/* Project links */}
          <div className="flex flex-wrap gap-3 mb-4">
            {project.github && (
              <Link href={project.github} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Github size={16} />
                  GitHub
                </Button>
              </Link>
            )}
            
            {project.demo && (
              <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink size={16} />
                  Live Demo
                </Button>
              </Link>
            )}
          </div>
          
          <DialogHeader className="mb-2 sm:mb-4">
            <DialogTitle className="text-lg sm:text-2xl break-words">{project.title}</DialogTitle>
            <DialogDescription className="text-xs sm:text-base mt-1 break-words">{project.description}</DialogDescription>
            
            {/* Tech Stack Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] pr-2 -mr-2">
            <div
              className="prose prose-xs sm:prose-sm lg:prose-base dark:prose-invert max-w-none mb-3 sm:mb-6 text-sm break-words"
              dangerouslySetInnerHTML={{ __html: project.contentHtml }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
