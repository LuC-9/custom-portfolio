import { getAllContentData } from "@/lib/content"
import ProjectsClient from "./ProjectsClient"
import { ProjectsSectionHeading } from "@/components/projects-section-heading"
import { Footer } from "@/components/footer"

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
          
          {/* Add Mermaid script via client component */}
          {/* <MermaidInitializer /> */}
        </div>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error fetching projects:", error)
    return <div>Failed to load projects</div>
  }
}

