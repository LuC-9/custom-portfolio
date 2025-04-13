"use client"

import { Book } from "lucide-react"
import { AnimatedSectionHeading } from "@/components/animated-section-heading"

export function BlogSectionHeading({ title = "Blog Posts" }) {
  return <AnimatedSectionHeading title={title} icon={Book} />
}