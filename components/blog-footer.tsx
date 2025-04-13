"use client"

import Link from "next/link"
import Image from "next/image"
import { usePersona } from "@/contexts/persona-context"
import { Button } from "@/components/ui/button"

export function BlogFooter() {
  const { isDeveloper, isGamer } = usePersona()

  // Content based on persona
  const content = {
    developer: {
      name: "Aarsh Mishra",
      bio: "Software developer passionate about creating beautiful, functional, and accessible web experiences. When not coding, I enjoy gaming, photography, and exploring new coffee shops.",
      profileImage: "/profile.jpg",
    },
    gamer: {
      name: "LuC",
      bio: "Competitive gamer and content creator focused on strategy games and FPS titles. I love sharing gaming tips, building community, and exploring new game mechanics.",
      profileImage: "/gamer-profile.gif?v=1", // Updated to .gif with cache-busting
    },
  }

  // Select content based on current persona
  const activeContent = isDeveloper ? content.developer : content.gamer

  return (
    <footer className="blog-footer">
      <div className="container mx-auto px-4">
        <div className="blog-footer-bio mb-8">
          <div className="profile-border w-16 h-16 flex-shrink-0">
            <Image
              src={activeContent.profileImage || "/placeholder.svg"}
              alt={activeContent.name}
              width={100}
              height={100}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-1">{activeContent.name}</h3>
            <p className="text-muted-foreground text-sm">{activeContent.bio}</p>
          </div>
          <Link href="/contact">
            <Button variant="outline" size="sm" className="rounded-full">
              Get in touch
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} {activeContent.name}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors">
              Projects
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}





