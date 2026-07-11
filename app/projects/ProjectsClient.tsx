"use client"

import { ProjectDialog } from "@/components/project-dialog"
import Image from "next/image"
import { SpotlightBorder } from "@/components/motion/spotlight-border"
import { ContentThumbnail } from "@/components/content-thumbnail"

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
  const rhythm = [
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-1 lg:row-span-1",
  ]

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(320px,auto)]">
      {projects.map((project, index) => (
        <div key={project.id} className={rhythm[index % rhythm.length]}>
          <ProjectDialog project={project}>
            <SpotlightBorder className="h-full overflow-hidden rounded-xl">
              <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-border/60 bg-card/70 transition-transform duration-300 hover:-translate-y-0.5">
                <div
                  className={`relative overflow-hidden ${index % rhythm.length === 0 || index % rhythm.length === 3 ? "aspect-[4/3]" : "aspect-video"}`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <ContentThumbnail title={project.title} content={project.content} />
                  )}
                </div>

                <div className="flex flex-1 flex-col space-y-3 p-5 md:p-6">
                  <h3 className="font-sans text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags?.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </SpotlightBorder>
          </ProjectDialog>
        </div>
      ))}
    </div>
  )
}
