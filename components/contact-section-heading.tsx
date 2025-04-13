"use client"

import { Mail } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"

export function ContactSectionHeading({ title = "Get In Touch" }) {
  return <AnimatedSectionHeading title={title} icon={Mail} />
}