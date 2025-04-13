"use client"

import { Users } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"

export function CommunitySectionHeading({ title = "Community" }) {
  return <AnimatedSectionHeading title={title} icon={Users} />
}