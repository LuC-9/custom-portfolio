"use client"

import { useState, useEffect } from "react"
import { Link } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState("")

  // Extract headings from content
  useEffect(() => {
    const doc = new DOMParser().parseFromString(content, "text/html")
    const headingElements = Array.from(doc.querySelectorAll("h2, h3, h4, h5, h6"))

    const items = headingElements.map((heading) => {
      // If heading doesn't have an id, we can't link to it
      if (!heading.id) {
        const id =
          heading.textContent
            ?.toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "") || ""
        heading.id = id
      }

      return {
        id: heading.id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.substring(1)),
      }
    })

    setHeadings(items)
  }, [content])

  // Track active heading on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    const headingElements = document.querySelectorAll("h2, h3, h4, h5, h6")
    headingElements.forEach((element) => observer.observe(element))

    return () => {
      headingElements.forEach((element) => observer.unobserve(element))
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="bg-secondary/20 rounded-lg p-4 mb-8 sticky top-24">
      <div className="flex items-center gap-2 mb-4 text-primary font-medium">
        <Link size={16} />
        <h3>Table of Contents</h3>
      </div>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}>
              <a
                href={`#${heading.id}`}
                className={`text-sm hover:text-primary transition-colors block py-1 border-l-2 pl-3 ${
                  activeId === heading.id
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" })
                  window.history.pushState(null, "", `#${heading.id}`)
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
