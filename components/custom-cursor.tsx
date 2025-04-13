"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseDown = () => setCursorVariant("click")
    const handleMouseUp = () => setCursorVariant("default")

    const handleMouseEnterLink = () => setCursorVariant("hover")
    const handleMouseLeaveLink = () => setCursorVariant("default")

    window.addEventListener("mousemove", mouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    // Add event listeners to all links and buttons
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterLink)
      el.addEventListener("mouseleave", handleMouseLeaveLink)
    })

    // Mobile/tablet check to hide cursor
    const isMobileOrTablet = () => {
      return window.matchMedia("(max-width: 1024px)").matches
    }

    if (isMobileOrTablet()) {
      document.body.classList.add("hide-custom-cursor")
    }

    return () => {
      window.removeEventListener("mousemove", mouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterLink)
        el.removeEventListener("mouseleave", handleMouseLeaveLink)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 24,
      width: 24,
    },
    hover: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 40,
      width: 40,
    },
    click: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 16,
      width: 16,
    },
  }

  // Hide on mobile/tablet
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) {
    return null
  }

  return (
    <motion.div
      className="custom-cursor"
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.5,
      }}
    />
  )
}
