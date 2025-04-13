"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface ScrollAnimationWrapperProps {
  children: React.ReactNode
  delay?: number
}

export function ScrollAnimationWrapper({ children, delay = 0 }: ScrollAnimationWrapperProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={
        isInView 
          ? { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                delay: delay * 0.1
              }
            } 
          : { opacity: 0, y: 100, scale: 0.9 }
      }
    >
      {children}
    </motion.div>
  )
}

