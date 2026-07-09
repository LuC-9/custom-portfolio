"use client"

import Link from "next/link"
import Image from "next/image"
import { usePersona } from "@/contexts/persona-context"
import { Button } from "@/components/ui/button"
import { MagneticHover } from "@/components/motion/magnetic-hover"

export function BlogFooter() {
  const { isDeveloper } = usePersona()

  const content = {
    developer: {
      name: "Aarsh Mishra",
      bio: "Software developer passionate about creating beautiful, functional, and accessible web experiences. When not coding, I enjoy gaming, photography, and exploring new coffee shops.",
      profileImage: "/profile.jpg",
    },
    gamer: {
      name: "LuC",
      bio: "Competitive gamer and content creator focused on strategy games and FPS titles. I love sharing gaming tips, building community, and exploring new game mechanics.",
      profileImage: "/gamer-profile.gif?v=1",
    },
  }

  const activeContent = isDeveloper ? content.developer : content.gamer

  return (
    <footer className="mt-10 rounded-xl border border-border/60 bg-card/40 p-6 md:p-7">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="h-16 w-16 overflow-hidden rounded-full border border-border/60">
            <Image
              src={activeContent.profileImage || "/placeholder.svg"}
              alt={activeContent.name}
              width={100}
              height={100}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
          <div className="space-y-1 text-left">
            <h3 className="font-sans text-xl font-semibold tracking-tight">{activeContent.name}</h3>
            <p className="text-muted-foreground text-sm">{activeContent.bio}</p>
          </div>
          <MagneticHover>
            <Button variant="outline" size="sm" className="rounded-full" asChild>
              <Link href="/contact">Get in touch</Link>
            </Button>
          </MagneticHover>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {activeContent.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/projects" className="transition-colors hover:text-primary">Projects</Link>
            <Link href="/blog" className="transition-colors hover:text-primary">Blog</Link>
            <Link href="/contact" className="transition-colors hover:text-primary">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
