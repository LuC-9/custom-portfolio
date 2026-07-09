"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Code, Gamepad2, LayoutGrid, Search, X } from "lucide-react"
import { BlogSectionHeading } from "@/components/blog-section-heading"
import { BlogPostCard } from "@/components/blog-post-card"
import { SpotlightBorder } from "@/components/motion/spotlight-border"
import { usePersona } from "@/contexts/persona-context"

export function BlogClientPage({ posts }: { posts: any[] }) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [personaFilter, setPersonaFilter] = useState<"all" | "developer" | "gamer">("all")
  const [filteredPosts, setFilteredPosts] = useState(posts)
  const { persona } = usePersona()

  // Initialize filter based on global persona
  useEffect(() => {
    setPersonaFilter(persona)
  }, [persona])

  // Filter posts based on search query and persona
  useEffect(() => {
    let filtered = posts

    if (personaFilter !== "all") {
      const gamerTags = ["gaming", "streaming", "twitch", "youtube", "esports", "games", "game"]
      filtered = filtered.filter(post => {
        const postTags = (post.tags || []).map((t: string) => t.toLowerCase())
        const hasGamerTag = postTags.some((t: string) => 
          gamerTags.some(gt => t.includes(gt))
        )
        
        if (personaFilter === "gamer") return hasGamerTag
        if (personaFilter === "developer") return !hasGamerTag
        return true
      })
    }

    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      filtered = filtered.filter(post => {
        return (
          post.title?.toLowerCase().includes(searchTerm) ||
          post.excerpt?.toLowerCase().includes(searchTerm) ||
          post.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        )
      })
    }
    setFilteredPosts(filtered.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }, [searchQuery, posts, personaFilter])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setSearchQuery("")
        searchInputRef.current?.blur()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const clearSearch = () => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  const featuredPosts = useMemo(() => filteredPosts.slice(0, 2), [filteredPosts])
  const compactPosts = useMemo(() => filteredPosts.slice(2), [filteredPosts])

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-12 px-4 pb-20 pt-28 md:space-y-14 md:px-6 lg:pt-32">
      <header className="space-y-6">
        <BlogSectionHeading title="Essays, build notes, and experiments." />
        <p className="max-w-[65ch] text-sm leading-relaxed text-muted-foreground md:text-base">
          Browse writing across software engineering and gaming workflows. Use persona filters to narrow the feed, or search by
          keywords and tags.
        </p>
      </header>

      <section className="grid gap-6 rounded-xl border border-border/60 bg-card/40 p-5 md:p-7 lg:grid-cols-12">
        <div className="space-y-2 lg:col-span-6">
          <label htmlFor="blog-search" className="block text-sm font-medium text-foreground">
            Search articles
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="blog-search"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-full border border-border bg-input pl-11 pr-12 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border/60 p-1 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">Shortcut: Cmd/Ctrl + K</p>
        </div>

        <div className="space-y-2 lg:col-span-6">
          <p className="text-sm font-medium text-foreground">Filter by persona</p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: "All", icon: LayoutGrid },
              { key: "developer", label: "Developer", icon: Code },
              { key: "gamer", label: "Gamer", icon: Gamepad2 },
            ].map((item) => {
              const Icon = item.icon
              const active = personaFilter === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPersonaFilter(item.key as "all" | "developer" | "gamer")}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {searchQuery
              ? `${filteredPosts.length} result${filteredPosts.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `${filteredPosts.length} article${filteredPosts.length !== 1 ? "s" : ""} published`}
          </p>
        </div>
      </section>

      {(!posts || posts.length === 0) ? (
        <div className="rounded-xl border border-border/60 bg-card/40 px-6 py-16 text-center">
          <h3 className="font-sans text-2xl font-semibold tracking-tight">No blog posts yet</h3>
          <p className="mt-2 text-muted-foreground">Blog posts will appear here once they are published.</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="grid gap-6 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <SpotlightBorder key={post.id} className="overflow-hidden rounded-xl">
                  <BlogPostCard post={post} variant="featured" />
                </SpotlightBorder>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/40 p-5 lg:col-span-4">
            <h2 className="font-sans text-2xl font-semibold tracking-tight">More posts</h2>
            <div className="mt-4 divide-y divide-border/40">
              {compactPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-border/60 bg-card/40 px-6 py-16 text-center">
          <h3 className="font-sans text-2xl font-semibold tracking-tight">No articles found</h3>
          <p className="mt-2 text-muted-foreground">No posts match "{searchQuery}". Try different keywords.</p>
          <button type="button" onClick={clearSearch} className="mt-4 text-sm font-medium text-primary hover:underline">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}