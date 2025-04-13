"use client"

import Link from "next/link"
import { usePersona } from "@/contexts/persona-context"
import { Github, Linkedin, Twitter, Twitch, Mail, MessageSquare, Youtube } from "lucide-react"

export function Footer() {
  const { isDeveloper } = usePersona()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              &copy; {currentYear} {isDeveloper ? "Aarsh Mishra" : "LuC"}. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link href="https://github.com/LuC-9/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/in/aarsh-mishra09/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="mailto:aarshmail@gmail.com" aria-label="Email">
              <Mail size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="https://discord.gg/Sd8Uq73FeK" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <MessageSquare size={20} className="text-muted-foreground hover:text-primary transition-colors" />
            </Link>
           

            {!isDeveloper && (
              <Link href="https://www.youtube.com/@LuC-Throws" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                <Youtube size={20} className="text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            )}

            {!isDeveloper && (
              <Link href="https://www.twitch.tv/xrshluc" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                <Twitch size={20} className="text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}


