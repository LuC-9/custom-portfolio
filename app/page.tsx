import { HomeContent } from "./HomeContent"
import { HomeExperienceSection } from "@/components/home-experience-section"
import { Footer } from "@/components/footer"
import { getAllContentData, getExperiences } from "@/lib/content"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChevronDown } from "lucide-react"
import { ProjectDialog } from "@/components/project-dialog"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"

export default async function Home() {
  const developerExperiences = await getExperiences()
  const gamingExperiences = await getAllContentData("gaming-experience")
  const projects = await getAllContentData("projects")
  const blogs = await getAllContentData("blog")
  
  // Filter featured content
  const featuredProjects = projects.filter(project => project.featured === true)
  const featuredBlogs = blogs.filter(blog => blog.featured === true)
  
  return (
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

        {/* Add more space between experience and featured projects section */}
        <div className="mt-16"></div>

        {/* Featured projects section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.map((project, index) => (
                <ScrollAnimationWrapper key={project.id} delay={index}>
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
                      <CardHeader className="p-3">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags && project.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </ProjectDialog>
                </ScrollAnimationWrapper>
              ))
            ) : (
              <p>No featured projects available</p>
            )}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/projects" className="inline-flex items-center gap-1 text-sm font-medium">
              <span>View All Projects</span>
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Add more space above the featured blogs section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs && featuredBlogs.length > 0 ? (
              featuredBlogs.map((post, index) => (
                <ScrollAnimationWrapper key={post.id} delay={index}>
                  <Link href={`/blog/${post.id}`}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:border-primary/30">
                      {post.image ? (
                        <div className="aspect-video relative overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-secondary/20 flex items-center justify-center">
                          <div className="text-4xl text-primary/40">
                            {post.title.charAt(0)}
                          </div>
                        </div>
                      )}
                      <CardHeader className="p-3">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock size={12} className="mr-1" />
                          {post.date}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimationWrapper>
              ))
            ) : (
              <p>No featured blog posts available</p>
            )}
          </div>
          
          <div className="flex justify-center mt-8">
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium">
              <span>View All Blogs</span>
              <ChevronDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <Footer />
      </div>
    </main>
  )
}




