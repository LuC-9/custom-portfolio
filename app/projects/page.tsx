import { getAllContentData } from "@/lib/content"
import { ProjectsClient } from "./ProjectsClient"
import { ProjectsSectionHeading } from "@/components/projects-section-heading"
import { Footer } from "@/components/footer"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Projects | Aarsh Mishra's Portfolio",
  description: "Explore Aarsh Mishra's software development projects, including web applications, games, and open-source contributions.",
  keywords: ['Aarsh Mishra', 'projects', 'portfolio', 'web development', 'software engineering', 'React', 'Next.js', 'TypeScript'],
  alternates: {
    canonical: 'https://www.byluc.in/projects'
  },
  openGraph: {
    title: "Projects | Aarsh Mishra's Portfolio",
    description: "Explore Aarsh Mishra's software development projects and technical work.",
    url: 'https://www.byluc.in/projects',
    type: 'website'
  }
}

export default async function ProjectsPage() {
  try {
    const projects = await getAllContentData("projects")
    
    return (
      <div className="flex flex-col min-h-screen">
        <div className="mx-auto w-full max-w-[1400px] flex-grow px-4 pb-16 pt-28 md:px-6 lg:pt-32">
          <div className="pb-10">
            <ProjectsSectionHeading />
          </div>
          <ProjectsClient projects={projects} />
        </div>
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 md:px-6">
          <Footer />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
    return <div>Failed to load projects</div>
  }
}
