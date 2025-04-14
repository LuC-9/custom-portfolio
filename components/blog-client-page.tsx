"use client"

import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"
import { BlogSectionHeading } from "@/components/blog-section-heading"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { BlogPostCard } from "@/components/blog-post-card"

export function BlogClientPage({ posts }) {
  const blogSectionRef = useRef(null)

  const scrollToBlogs = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      {/* Hero section with intro - reduced height and spacing */}
      <div className="min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center mb-16 md:mb-24">
        <div className="bg-secondary/20 text-foreground p-6 md:p-8 rounded-lg border border-secondary/50">
          <p className="font-mono text-base md:text-lg mb-6">
            Hi there! I am Aarsh. Welcome to my personal blog. Thus far, I have written only a few articles. 
            My blogs mostly have content around tools and technologies, tutorials, book / research-paper summaries, Gaming, Gadgets & Tech etc.
          </p>
          
          <div className="mt-4 border-2 border-green-400/70 p-4 md:p-6 rounded-md bg-background/50 relative">
            <div className="absolute inset-0 border border-green-400/40 rounded-md m-1 pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-400/50 blur-md -z-10"></div>
            <h3 className="font-mono text-xl font-bold mb-2">Introducing <span className="text-green-400">&lt;Minis/&gt;</span></h3>
            <p className="font-mono">Sharing Byte-sized knowledge everyday for people on the go.</p>
          </div>
          
          <div className="flex justify-center mt-8 md:mt-12">
            <button 
              onClick={scrollToBlogs}
              className="group flex flex-col items-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            >
              <p className="mb-2 group-hover:text-primary">Scroll down to explore</p>
              <div className="animate-bounce inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <a 
              href="https://twitter.com/LuC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-700/80 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center shadow-md"
            >
              @LuC <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <Link 
              href="/about"
              className="px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-300 neon-button"
            >
              Portfolio <span className="ml-1">👤</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div ref={blogSectionRef} className="pt-16 md:pt-24 mt-8 md:mt-16">
        <BlogSectionHeading />
        <div className="grid gap-8 mt-8 md:mt-12">
          {posts.map((post, index) => (
            <ScrollAnimationWrapper key={post.id} delay={index}>
              <BlogPostCard post={post} />
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </div>
  )
}












