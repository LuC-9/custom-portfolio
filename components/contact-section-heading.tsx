"use client"

import { Mail } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"
import { useIsMobile } from "@/hooks/use-mobile"

export function ContactSectionHeading({ title = "Get In Touch" }) {
  const isMobile = useIsMobile()
  
  return (
    <div className={isMobile ? "mb-2" : "mb-4"}>
      <AnimatedSectionHeading title={title} icon={Mail} />
    </div>
  )
}
