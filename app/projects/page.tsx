import { Metadata } from "next"
import { getAllContentData, getContentData } from "@/lib/content"
import ProjectsClient from "./ProjectsClient"
import { ProjectsSectionHeading } from "@/components/projects-section-heading"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of web development and software engineering projects, featuring React, Next.js, TypeScript and more.",
}

export default async function ProjectsPage() {
  try {
    // Fetch projects data with processed content
    const projects = await getAllContentData("projects")
    
    // Debug log to check projects data
    console.log(`Projects loaded: ${projects.length}`)
    console.log(`First project content length: ${projects[0]?.content?.length || 0}`)
    
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="mb-6">
            <ProjectsSectionHeading />
          </div>
          <ProjectsClient projects={projects} />
        </div>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error loading projects:", error)
    return (
      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="mb-6">
            <ProjectsSectionHeading />
          </div>
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Error loading projects. Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

















