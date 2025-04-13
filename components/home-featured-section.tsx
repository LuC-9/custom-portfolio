'use client'

import { usePersona } from "@/contexts/persona-context"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { ProjectDialog } from "@/components/project-dialog"
import { Twitch, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export function HomeFeaturedSection({ 
  featuredProjects, 
  featuredBlogs 
}: { 
  featuredProjects: any[]
  featuredBlogs: any[]
}) {
  const { isDeveloper } = usePersona()
  
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Developer-specific content */}
      {isDeveloper ? (
        <>
          {/* Featured Projects Section - heading removed */}
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
                      <div className="p-4">
                        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags && project.tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </ProjectDialog>
                </ScrollAnimationWrapper>
              ))
            ) : (
              <p>No featured projects found.</p>
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects">
              <Button variant="outline" className="rounded-full">View All Projects</Button>
            </Link>
          </div>
        </>
      ) : null}

      {/* Gamer-specific content */}
      {!isDeveloper ? (
        <div>
          {/* My Streams Section - heading removed */}
          <div className="grid gap-8">
            <div className="bg-secondary/30 rounded-lg p-8 text-center">
              <Youtube className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-bold mb-4">YouTube</h2>
              <p className="text-muted-foreground mb-6">
                Join me live on Youtube where I stream strategy games and FPS gameplay.
              </p>
              <Button className="rounded-full">
                <Youtube className="mr-2" size={16} />
                <Link 
                  href="https://www.youtube.com/@LuC-Throws" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Subscribe on Youtube
                </Link>
              </Button>
            </div>

            <div className="bg-secondary/30 rounded-lg p-8 text-center">
              <Twitch className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-bold mb-4">Twitch</h2>
              <p className="text-muted-foreground mb-6">
                Catch my live streams on Twitch for exclusive content, chat interaction, and gaming sessions.
              </p>
              <Button className="rounded-full">
                <Twitch className="mr-2" size={16} />
                <Link 
                  href="https://www.twitch.tv/xrshluc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Follow on Twitch
                </Link>
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/community?tab=streams">
                <Button variant="outline" className="rounded-full">View All Streams</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      {/* Featured Articles Section - heading removed */}
      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredBlogs && featuredBlogs.length > 0 ? (
            featuredBlogs.map((blog, index) => (
              <ScrollAnimationWrapper key={blog.id} delay={index}>
                <Link href={`/blog/${blog.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 relative">
                    {blog.image ? (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{formatDate(blog.date)}</p>
                      <p className="text-muted-foreground text-sm mb-4">{blog.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags && blog.tags.map((tag: string) => (
                          <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </Link>
              </ScrollAnimationWrapper>
            ))
          ) : (
            <p>No featured blogs found.</p>
          )}
        </div>
        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">View All Articles</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}





