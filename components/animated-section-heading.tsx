"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface AnimatedSectionHeadingProps {
  title: string
  icon: LucideIcon
  className?: string
}

export function AnimatedSectionHeading({ title, icon: Icon, className = "" }: AnimatedSectionHeadingProps) {
  const [hasLoaded, setHasLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Trigger the load animation after component mounts
    setHasLoaded(true)
  }, [])

  return (
    <div className={`flex items-center justify-center gap-3 mb-10 ${className}`}>
      <motion.div
        initial={{ rotate: 0, scale: 0.8 }}
        animate={{ 
          rotate: hasLoaded ? 360 : 0, 
          scale: 1 
        }}
        whileHover={{ 
          rotate: isHovered ? 360 : 0,
          scale: 1.1,
          transition: { duration: 0.5 }
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="bg-primary/10 p-3 rounded-full"
      >
        <Icon size={28} className="text-primary" />
      </motion.div>
      <h2 className="text-3xl font-bold">{title}</h2>
    </div>
  )
}