"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from content
    const doc = new DOMParser().parseFromString(content, 'text/html')
    const headingElements = Array.from(doc.querySelectorAll('h2, h3, h4'))
    
    const extractedHeadings = headingElements.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1))
    }))
    
    setHeadings(extractedHeadings)
    
    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )
    
    // Observe all headings
    headingElements.forEach(heading => {
      if (heading.id) {
        const element = document.getElementById(heading.id)
        if (element) observer.observe(element)
      }
    })
    
    return () => {
      headingElements.forEach(heading => {
        if (heading.id) {
          const element = document.getElementById(heading.id)
          if (element) observer.unobserve(element)
        }
      })
    }
  }, [content])

  if (headings.length === 0) return null

  return (
    <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/50">
      <div 
        className="flex items-center justify-between font-medium mb-2 cursor-pointer lg:cursor-default"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base md:text-lg">Table of Contents</h3>
        <ChevronDown className={`h-4 w-4 transition-transform lg:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <nav className="toc-nav">
          <ul className="space-y-1 text-sm">
            {headings.map((heading) => (
              <li 
                key={heading.id}
                className={`${
                  heading.level === 2 ? 'pl-0' : 
                  heading.level === 3 ? 'pl-3' : 
                  'pl-6'
                }`}
              >
                <a
                  href={`#${heading.id}`}
                  className={`block py-1 hover:text-primary transition-colors ${
                    activeId === heading.id ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}
