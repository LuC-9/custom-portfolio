"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const doc = new DOMParser().parseFromString(content, 'text/html')
    const headingElements = Array.from(doc.querySelectorAll('h2, h3, h4'))
    
    const extractedHeadings = headingElements.map(heading => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.substring(1))
    }))
    
    setHeadings(extractedHeadings)
    
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

  const links = (
    <nav aria-label="Table of contents">
      <ul className="space-y-1.5 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${
              heading.level === 2 ? "pl-0" : heading.level === 3 ? "pl-3" : "pl-6"
            }`}
          >
            <a
              href={`#${heading.id}`}
              className={`block rounded-md px-2 py-1 transition-colors ${
                activeId === heading.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )

  return (
    <>
      <div className="xl:hidden">
        <Accordion type="single" collapsible className="w-full rounded-xl border border-border/60 bg-card/50 px-4">
          <AccordionItem value="toc" className="border-none">
            <AccordionTrigger className="py-3 text-base font-semibold hover:no-underline">
              <span className="inline-flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-primary" />
                Table of Contents
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">{links}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="hidden rounded-xl border border-border/60 bg-card/50 p-4 xl:block">
        <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">On this page</h3>
        {links}
      </div>
    </>
  )
}
