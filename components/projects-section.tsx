"use client"

import { Code2 } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getFeaturedProjects } from "@/lib/projects";

type Project = {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  github?: string
  demo?: string
}

export function ProjectsSection() {
  const projects = getFeaturedProjects();
  
  return (
    <section className="py-12" id="projects">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Projects</h2>
            <p className="mt-2 text-muted-foreground">Some of my featured projects</p>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium">
            <span>View All Projects</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Projects grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}


