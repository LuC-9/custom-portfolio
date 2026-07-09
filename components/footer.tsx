"use client"

import Link from "next/link"
import { usePersona } from "@/contexts/persona-context"
import { Github, Linkedin, Mail, MessageSquare, Twitch, Youtube } from "lucide-react"
import { XIcon } from "@/components/icons/x-icon"
import { LeetCodeIcon } from "@/components/icons/leetcode-icon"

export function Footer() {
  const { isDeveloper } = usePersona()

  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col items-center justify-between gap-4 px-4 md:flex-row md:gap-6 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="https://discord.gg/Sd8Uq73FeK" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <MessageSquare className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="mailto:aarshmail@gmail.com" aria-label="Email">
            <Mail className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="https://twitter.com/xrshLuC" target="_blank" rel="noopener noreferrer" aria-label="X">
            <XIcon className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          {isDeveloper ? (
            <>
              <Link href="https://github.com/LuC-9/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/aarsh-mishra09/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link href="https://leetcode.com/u/LuC9/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode">
                <LeetCodeIcon className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
            </>
          ) : (
            <>
              <Link href="https://www.twitch.tv/xrshluc" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                <Twitch className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
              <Link
                href="https://www.youtube.com/@LuC-Throws"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
              </Link>
            </>
          )}
        </div>

        <p className="font-mono text-xs text-muted-foreground">© 2026 · Aarsh Mishra (LuC)</p>

        <Link href="#top" className="font-mono text-xs text-muted-foreground transition-colors hover:text-primary" scroll>
          Back to top
        </Link>
      </div>
    </footer>
  )
}
