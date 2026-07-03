"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { LoadingSpinner } from "./loading-spinner"
import { motion, AnimatePresence } from "framer-motion"
import { emitGameEvent } from "@/lib/game/event-bus"

const ROUTE_TASK_IDS: Record<string, string> = {
  "/": "route:/",
  "/projects": "route:/projects",
  "/blog": "route:/blog",
  "/community": "route:/community",
  "/contact": "route:/contact",
}

export function NavigationEvents() {
  const [isLoading, setIsLoading] = useState(false)
  const loadedPages = useRef(new Set())
  const pathname = usePathname()
  const routeKey = pathname

  useEffect(() => {
    if (!loadedPages.current.has(routeKey)) {
      const taskId = ROUTE_TASK_IDS[pathname]
      if (taskId) {
        emitGameEvent({
          type: "page_visit",
          taskId,
          metadata: {
            route: pathname,
          },
        })
      }

      setIsLoading(true)
      
      const timer = setTimeout(() => {
        setIsLoading(false)
        loadedPages.current.add(routeKey)
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [pathname, routeKey])

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
