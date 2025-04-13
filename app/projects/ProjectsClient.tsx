"use client"

import { useEffect, useState } from "react"
import { usePersona } from "@/contexts/persona-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectDialog } from "@/components/project-dialog"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { FileCode } from "lucide-react"

// Define project type
interface ProjectProps {
  id: string
  title: string
  description: string
  content: string
  contentHtml?: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export function ProjectsClient({ projects }: { projects: ProjectProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ScrollAnimationWrapper key={project.id} delay={index % 3}>
          <ProjectDialog project={project}>
            <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/30 relative">
              {project.image ? (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <FileCode className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags && project.tags.slice(0, 4).map((tag, i) => (
                    <span 
                      key={i} 
                      className="text-xs bg-secondary px-2 py-1 rounded-full relative overflow-hidden group/tag"
                    >
                      <span className="relative z-10">{tag}</span>
                      <span className="absolute inset-0 opacity-0 group-hover/tag:opacity-100 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 transition-opacity duration-300"></span>
                    </span>
                  ))}
                  {project.tags && project.tags.length > 4 && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </ProjectDialog>
        </ScrollAnimationWrapper>
      ))}
    </div>
  )
}











