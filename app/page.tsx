import { HomeContent } from "./HomeContent"
import { HomeExperienceSection } from "@/components/home-experience-section"
import { HomeFeaturedSection } from "@/components/home-featured-section"
import { Footer } from "@/components/footer"
import { getAllContentData, getExperiences } from "@/lib/content"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronDown } from "lucide-react"
import { ProjectDialog } from "@/components/project-dialog"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { PersonStructuredData, WebsiteStructuredData } from './structured-data'

export const metadata: Metadata = {
  title: 'LuC (Aarsh Mishra) | Developer & Gamer',
  description: 'Official portfolio website of Aarsh Mishra, also known as LuC. Software Developer, Web Engineer, and Gaming Enthusiast.',
  keywords: ['Aarsh Mishra', 'LuC', 'developer', 'software engineer', 'web developer', 'portfolio', 'gaming', 'programmer'],
  alternates: {
    canonical: 'https://byluc.in'
  }
}

export default async function Home() {
  const developerExperiences = await getExperiences()
  const gamingExperiences = await getAllContentData("gaming-experience")
  const projects = await getAllContentData("projects")
  const blogs = await getAllContentData("blog")
  
  // Filter featured content
  const featuredProjects = projects.filter(project => project.featured === true)
  const featuredBlogs = blogs.filter(blog => blog.featured === true)
  
  return (
    <>
      <PersonStructuredData />
      <WebsiteStructuredData />
      <main className="flex flex-col min-h-screen">
        <div className="flex-1">
          <HomeContent />
          
          {/* Add more space above the experience section */}
          <div className="mt-8">
            <HomeExperienceSection 
              developerExperiences={developerExperiences} 
              gamingExperiences={gamingExperiences} 
            />
          </div>

          {/* Featured content section - conditionally rendered based on persona */}
          <HomeFeaturedSection 
            featuredProjects={featuredProjects} 
            featuredBlogs={featuredBlogs} 
          />
        </div>
        <div className="container mx-auto px-4">
          <Footer />
        </div>
      </main>
    </>
  )
}




