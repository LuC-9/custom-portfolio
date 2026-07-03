'use client'

import { usePersona } from "@/contexts/persona-context"
import Link from "next/link"
import Image from "next/image"
import { PersonaToggle } from "@/components/persona-toggle"
import { Clock, Github, Linkedin, Twitter, Youtube, Mail, Globe, Twitch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { XIcon } from "@/components/icons/x-icon"
import { LeetCodeIcon } from "@/components/icons/leetcode-icon"
import { track } from "@vercel/analytics";
import { DiscordStatus } from "@/components/discord-status"
import { emitGameEvent } from "@/lib/game/event-bus"

export function HomeContent() {
  const trackCuratedLink = (taskId: string, href: string) => {
    emitGameEvent({
      type: "link_click",
      taskId,
      metadata: { href },
    })
  }

  const { isDeveloper, isGamer } = usePersona()
  const [currentTime, setCurrentTime] = useState("")
  const [timeZone, setTimeZone] = useState("")
  
  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setTimeZone(now.toLocaleDateString([], { timeZoneName: 'short' }).split(', ')[1] || '')
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])
  
  // Content based on persona
  const content = {
    developer: {
      name: "Aarsh Mishra",
      description:
        "A Software Engineer specializing in building exceptional digital experiences with modern technologies.",
      primaryButton: {
        text: "Get in touch",
        href: "/contact",
        icon: <Globe className="ml-2 h-4 w-4" />,
      },
      secondaryButton: {
        text: "View my work",
        href: "/projects",
      },
      resumeButton: {
        text: "Resume",
        href: "/resume.pdf",
      },
    },
    gamer: {
      name: "LuC",
      description:
        "Competitive gamer and streamer focused on strategy games, first-person shooters, and community building.",
      primaryButton: {
        text: "Watch Streams",
        href: "/community?tab=streams",
        icon: <Youtube className="ml-2 h-4 w-4" />,
      },
      secondaryButton: {
        text: "Join Community",
        href: "/community",
      },
    },
  }

  // Select content based on current persona
  const activeContent = isDeveloper ? content.developer : content.gamer

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 pt-32 pb-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left column - Profile image and persona toggle */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-64 h-64 md:w-72 md:h-72"
            >
              <div className="profile-border w-full h-full relative overflow-hidden rounded-full">
                <Image
                  src={isDeveloper ? "/profile.jpg" : "/gamer-profile.gif?v=1"}
                  alt={isDeveloper ? "Aarsh Mishra profile photo" : "LuC gamer profile"}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 16rem, 18rem"
                />
              </div>
            </motion.div>
            
            <div className="mt-6">
              <PersonaToggle />
            </div>
            
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>{currentTime} {timeZone}</span>
            </div>
          </div>
          
          {/* Right column - Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Hi, I'm <span className="text-primary">{activeContent.name}</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {activeContent.description}
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Button asChild>
                  <Link href={activeContent.primaryButton.href}>
                    {activeContent.primaryButton.text}
                    {activeContent.primaryButton.icon}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={activeContent.secondaryButton.href}>
                    {activeContent.secondaryButton.text}
                  </Link>
                </Button>
                {isDeveloper && (
                  <Link 
                    href={activeContent.resumeButton.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => {
                      emitGameEvent({
                        type: "resume_download",
                        taskId: "resume:download",
                        metadata: {
                          file: activeContent.resumeButton.href,
                        },
                      })
                      track("resume_download", { 
                        persona: "developer",
                        resumeVersion: "latest" 
                      });
                    }}
                  >
                    <Button variant="outline" className="rounded-full">
                      {activeContent.resumeButton.text}
                    </Button>
                  </Link>
                )}
              </div>
              
              <div className="mt-6">
                <DiscordStatus />
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {isDeveloper ? (
                    <>
                      <Link
                        href="https://github.com/LuC-9"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        onClick={() => trackCuratedLink("link:github", "https://github.com/LuC-9")}
                      >
                        <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                      <Link
                        href="https://www.linkedin.com/in/aarsh-mishra09/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                        onClick={() => trackCuratedLink("link:linkedin", "https://www.linkedin.com/in/aarsh-mishra09/")}
                      >
                        <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                      <Link
                        href="https://twitter.com/xrshLuC"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X (formerly Twitter)"
                        onClick={() => trackCuratedLink("link:twitter", "https://twitter.com/xrshLuC")}
                      >
                        <XIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                      <Link
                        href="https://leetcode.com/u/LuC9/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LeetCode"
                        onClick={() => trackCuratedLink("link:leetcode", "https://leetcode.com/u/LuC9/")}
                      >
                        <LeetCodeIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="https://www.twitch.tv/xrshluc"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitch"
                        onClick={() => trackCuratedLink("link:twitch", "https://www.twitch.tv/xrshluc")}
                      >
                        <Twitch className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                      <Link
                        href="https://www.youtube.com/@LuC-Throws"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="YouTube"
                        onClick={() => trackCuratedLink("link:youtube", "https://www.youtube.com/@LuC-Throws")}
                      >
                        <Youtube className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                      <Link
                        href="https://twitter.com/xrshLuC"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="X (formerly Twitter)"
                        onClick={() => trackCuratedLink("link:twitter", "https://twitter.com/xrshLuC")}
                      >
                        <XIcon className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                      </Link>
                    </>
                  )}
                  <Link
                    href="https://discord.gg/Sd8Uq73FeK"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Discord server"
                    onClick={() => trackCuratedLink("link:discord", "https://discord.gg/Sd8Uq73FeK")}
                  >
                    <Globe className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                  <Link
                    href="mailto:aarshmail@gmail.com"
                    aria-label="Email"
                    onClick={() => trackCuratedLink("link:email", "mailto:aarshmail@gmail.com")}
                  >
                    <Mail className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
