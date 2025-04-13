"use client"

import { BookOpen } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"
import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { getFeaturedBlogPosts } from "@/lib/blog";

type BlogPost = {
  id: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  image: string
}

export function BlogSection() {
  const posts = getFeaturedBlogPosts();
  
  return (
    <section className="py-12" id="blog">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog</h2>
            <p className="mt-2 text-muted-foreground">My featured articles and thoughts</p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-medium">
            <span>View All Blogs</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
        </div>
        
        {/* Blog posts grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link key={post.id} href={`/blog/${post.id}`}>
      <div className="bg-secondary/20 rounded-lg overflow-hidden border border-secondary/50 hover:border-primary/30 transition-colors h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
        {post.image && (
          <div className="relative h-48">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags && post.tags.length > 0 && post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full relative overflow-hidden group/tag">
                <span className="relative z-10">{tag}</span>
                <span className="absolute inset-0 opacity-0 group-hover/tag:opacity-100 bg-gradient-to-r from-red-500/20 via-purple-500/20 to-blue-500/20 transition-opacity duration-300"></span>
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
          <div className="text-xs text-muted-foreground">
            {formatDate(post.date)}
          </div>
        </div>
      </div>
    </Link>
  );
}

