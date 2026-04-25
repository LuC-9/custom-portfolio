import { Code2, ChevronDown } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getFeaturedProjects } from "@/lib/projects";
import { ProjectDialog } from "@/components/project-dialog"
import { Card } from "@/components/ui/card"

type Project = {
  id: string
  title: string
  description: string
  image?: string
  tags?: string[]
  github?: string
  demo?: string
  [key: string]: any
}

export async function ProjectsSection() {
  const projects = await getFeaturedProjects();
  
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
            <ProjectDialog key={project.id} project={project}>
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
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags && project.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full relative overflow-hidden group/tag">
                        <span className="relative z-10">{tag}</span>
                        <span className="absolute inset-0 opacity-0 group-hover/tag:opacity-100 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 transition-opacity duration-300"></span>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            </ProjectDialog>
          ))}
        </div>
      </div>
    </section>
  );
}


