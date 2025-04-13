"use client"

import { Code } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"

export function ProjectsSectionHeading({ title = "Projects" }) {
  return <AnimatedSectionHeading title={title} icon={Code} />
}