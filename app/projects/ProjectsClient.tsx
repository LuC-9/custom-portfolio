"use client"

import { useEffect, useState } from "react"
import { usePersona } from "@/contexts/persona-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectDialog } from "@/components/project-dialog"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"

// Define project type
interface ProjectProps {
  id: string
  title: string
  description: string
  content: string
  contentHtml?: string // Add this if your content processing returns contentHtml
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export default function ProjectsClient({ projects = [] }: { projects: ProjectProps[] }) {
  const { isDeveloper, setPersona } = usePersona()
  
  useEffect(() => {
    // Switch to developer persona if not already active
    if (!isDeveloper) {
      setPersona("developer")
    }
  }, [isDeveloper, setPersona])

  if (projects.length === 0) {
    return (
      <div className="flex-1">
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">Loading projects or no projects found...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ScrollAnimationWrapper key={project.id} delay={index % 3}>
          <ProjectDialog project={project}>
            <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/30 relative">
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
                <div className="aspect-video bg-secondary/20 flex items-center justify-center">
                  <div className="text-4xl text-primary/40">
                    {project.title.charAt(0)}
                  </div>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-wrap gap-2 pt-0">
                {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags && project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </CardFooter>
            </Card>
          </ProjectDialog>
        </ScrollAnimationWrapper>
      ))}
    </div>
  )
}











