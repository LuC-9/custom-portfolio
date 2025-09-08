"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Tag, Search, X } from "lucide-react"
import { BlogSectionHeading } from "@/components/blog-section-heading"
import { ScrollAnimationWrapper } from "@/components/scroll-animation-wrapper"
import { BlogPostCard } from "@/components/blog-post-card"

export function BlogClientPage({ posts }: { posts: any[] }) {
  console.log('BlogClientPage posts:', posts) // Debug log
  const blogSectionRef = useRef(null)
  const searchInputRef = useRef(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Filter posts based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts)
      return
    }

    const filtered = posts.filter(post => {
      const searchTerm = searchQuery.toLowerCase()
      return (
        post.title?.toLowerCase().includes(searchTerm) ||
        post.excerpt?.toLowerCase().includes(searchTerm) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    })
    setFilteredPosts(filtered)
  }, [searchQuery, posts])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // Escape to clear search and blur
      if (e.key === 'Escape') {
        setSearchQuery("")
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const scrollToBlogs = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      {/* Hero section with intro - reduced height and spacing */}
      <div className="min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center mb-16 md:mb-24">
        <div className="bg-secondary/20 text-foreground p-6 md:p-8 rounded-lg border border-secondary/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="font-mono text-xl font-bold">Blogs</h1>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search blogs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-20 w-full sm:w-64 bg-background/50 border-border/50 focus:border-primary/50"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-1 hover:bg-secondary/50 rounded transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="h-3 w-3 text-muted-foreground" />
                    </button>
                  )}
                  <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded border">
                    <span>⌘</span><span>K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
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
              href="https://twitter.com/xrshLuC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-700/80 hover:bg-gray-700 px-4 py-2 rounded-md text-sm transition-colors flex items-center shadow-md"
            >
              @xrshLuC <svg className="ml-1 w-4 h-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">All Blogs</h2>
          <p className="text-muted-foreground mt-2">
              {searchQuery ? (
                <span>
                  {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
              ) : (
                <span>{posts?.length || 0} article{(posts?.length || 0) !== 1 ? 's' : ''} published</span>
              )}
            </p>
          </div>
        </div>
        
        <div className="grid gap-8">
          {!posts || posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
              <p className="text-muted-foreground">
                Blog posts will appear here once they are published.
              </p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
              <ScrollAnimationWrapper key={post.id} delay={index * 0.1}>
                <BlogPostCard post={post} searchQuery={searchQuery} />
              </ScrollAnimationWrapper>
            ))
          ) : (
            <div className="text-center py-16">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                No articles match your search for "{searchQuery}". Try different keywords.
              </p>
              <button
                onClick={clearSearch}
                className="text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}












