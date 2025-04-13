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
        </div>
      </div>
      
      <div ref={blogSectionRef} className="pt-8 md:pt-16">
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












