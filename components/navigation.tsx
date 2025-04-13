"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { usePersona } from "@/contexts/persona-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { isDeveloper, isGamer } = usePersona()

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Define navigation links based on persona
  const developerLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  const gamerLinks = [
    { href: "/", label: "Home" },
    { href: "/community", label: "Community" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]

  // Select links based on current persona
  const links = isDeveloper ? developerLinks : gamerLinks

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold flex items-center">
            <span className="text-primary mr-1">{isDeveloper ? "AM." : "LuC"}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative hover:text-primary transition-colors ${
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute left-0 top-full block h-[2px] w-full bg-primary"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="flex items-center md:hidden gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 ${
                      pathname === link.href ? "text-primary" : "text-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}




