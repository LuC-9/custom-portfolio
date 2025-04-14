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
import { ChevronDown } from "lucide-react"

export function BlogClientPage({ posts }) {
  const blogSectionRef = useRef(null)

  const scrollToBlogs = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      {/* Hero section with intro - reduced height and spacing */}
      <div className="min-h-[40vh] md:min-h-[50vh] flex flex-col justify-center mb-8 md:mb-16">
        <div className="bg-secondary/20 text-foreground p-4 md:p-6 lg:p-8 rounded-lg border border-secondary/50">
          <p className="font-mono text-sm md:text-base lg:text-lg mb-4 md:mb-6">
            Hi there! I am Aarsh. Welcome to my personal blog. Thus far, I have written only a few articles. 
            My blogs mostly have content around tools and technologies, tutorials, book / research-paper summaries, Gaming, Gadgets & Tech etc.
          </p>
          
          <button
            onClick={scrollToBlogs}
            className="inline-flex items-center text-sm md:text-base text-primary hover:text-primary/80 transition-colors"
          >
            <span>View all articles</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div ref={blogSectionRef} className="pt-8 md:pt-16 mt-4 md:mt-8">
        <BlogSectionHeading />
        <div className="grid gap-6 md:gap-8 mt-6 md:mt-8">
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












