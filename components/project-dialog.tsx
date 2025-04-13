"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"

interface ProjectProps {
  id: string
  title: string
  description: string
  content: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export function ProjectDialog({ project, children }: { project: ProjectProps; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  
  // Debug log to check project content
  console.log("Project content:", {
    title: project.title,
    contentLength: project?.content?.length || 0,
    contentSample: project?.content?.substring(0, 100) || "No content"
  });

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-auto overflow-hidden flex flex-col">
          <DialogHeader className="mb-2 sm:mb-4">
            <DialogTitle className="text-lg sm:text-2xl break-words">{project.title}</DialogTitle>
            <DialogDescription className="text-xs sm:text-base mt-1 break-words">{project.description}</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[70vh] pr-2 -mr-2">
            {project.image && (
              <div className="mb-3 sm:mb-6 rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={600}
                  height={300}
                  className="object-cover w-full h-auto"
                  priority
                />
              </div>
            )}

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-6">
              {project.tags &&
                project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs py-0.5 px-2 sm:text-sm whitespace-normal">
                    {tag}
                  </Badge>
                ))}
            </div>

            <div
              className="prose prose-xs sm:prose-sm lg:prose-base dark:prose-invert max-w-none mb-3 sm:mb-6 text-sm break-words"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-3 sm:mt-6">
            {project.github && (
              <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                <Link href={project.github} target="_blank" rel="noopener noreferrer" className="gap-1 sm:gap-2">
                  <Github size={14} />
                  <span className="whitespace-nowrap">View Code</span>
                </Link>
              </Button>
            )}
            {project.demo && (
              <Button size="sm" className="w-full sm:w-auto" asChild>
                <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="gap-1 sm:gap-2">
                  <ExternalLink size={14} />
                  <span className="whitespace-nowrap">Live Demo</span>
                </Link>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}







