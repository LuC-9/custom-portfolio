"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { emitGameEvent } from "@/lib/game/event-bus"
import { MagneticHover } from "@/components/motion/magnetic-hover"

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
  const handleOpen = () => {
    emitGameEvent({
      type: "project_open",
      taskId: `project:${project.id}`.toLowerCase(),
      metadata: {
        projectId: project.id,
        projectTitle: project.title,
      },
    })
    setIsOpen(true)
  }

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] max-w-5xl rounded-xl border-border/60 bg-popover shadow-kinetic">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 bg-muted/40">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {project.github ? (
                  <MagneticHover>
                    <Button variant="outline" className="w-full rounded-full" asChild>
                      <Link href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Link>
                    </Button>
                  </MagneticHover>
                ) : null}
                {project.demo ? (
                  <MagneticHover>
                    <Button variant="outline" className="w-full rounded-full" asChild>
                      <Link href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </Link>
                    </Button>
                  </MagneticHover>
                ) : null}
              </div>
            </div>

            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="font-sans text-2xl font-semibold tracking-tight">{project.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">{project.description}</DialogDescription>
              </DialogHeader>
              {project.tags?.length ? (
                <div className="space-y-2">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-border/50 bg-card/50 p-4">
                <div
                  className="prose prose-sm max-w-none break-words dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: project.contentHtml }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
