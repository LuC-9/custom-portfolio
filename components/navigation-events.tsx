"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"
import { motion, AnimatePresence } from "framer-motion"

export function NavigationEvents() {
  const [isLoading, setIsLoading] = useState(false)
  const loadedPages = useRef(new Set())
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Create a unique key for this route (pathname + search params)
  const routeKey = pathname + searchParams.toString()

  useEffect(() => {
    // Only show loading if this page hasn't been loaded before
    if (!loadedPages.current.has(routeKey)) {
      // Show loading state
      setIsLoading(true)
      
      // Hide loading state after a delay
      const timer = setTimeout(() => {
        setIsLoading(false)
        // Mark this page as loaded
        loadedPages.current.add(routeKey)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [routeKey])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50"
        >
          <LoadingSpinner size="lg" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NavigationEvents
