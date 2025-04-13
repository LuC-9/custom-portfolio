'use client'

import { usePersona } from "@/contexts/persona-context"
import Link from "next/link"
import Image from "next/image"
import { PersonaToggle } from "@/components/persona-toggle"
import { Clock, Github, Linkedin, Twitter, Youtube, Mail, Globe, Twitch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function HomeContent() {
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
        "A passionate software developer specializing in building exceptional digital experiences with modern technologies.",
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
      profileImage: "/profile.jpg",
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
      profileImage: "/gamer-profile.gif?v=1",
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
              <div className="profile-border w-full h-full">
                <Image
                  src={activeContent.profileImage}
                  alt={`${activeContent.name}'s profile picture`}
                  fill
                  priority
                  className="object-cover rounded-full"
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
                  <Link href={activeContent.resumeButton.href} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-full">
                      {activeContent.resumeButton.text}
                    </Button>
                  </Link>
                )}
              </div>
              
              <div className="flex space-x-6 mt-8">
                {isDeveloper ? (
                  <>
                    <Link href="https://github.com/LuC-9" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/aarsh-mishra09/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="https://www.twitch.tv/xrshluc" target="_blank" rel="noopener noreferrer" aria-label="Twitch">
                      <Twitch className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://www.youtube.com/@LuC-Throws" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                      <Youtube className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                  </>
                )}
                <Link href="mailto:aarshmail@gmail.com" aria-label="Email">
                  <Mail className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}




