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
    // Fetch projects data with processed content
    const projects = await getAllContentData("projects")
    
    return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 flex-grow">
          <div className="pt-24 pb-12">
            <ProjectsSectionHeading />
          </div>
          <ProjectsClient projects={projects} />
        </div>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
    return <div>Failed to load projects</div>
  }
}
