import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { PersonaProvider } from "@/contexts/persona-context"
import { Navigation } from "@/components/navigation"
import { Toaster } from '@/components/ui/sonner'
import { NavigationEvents } from "@/components/navigation-events"

// Load JetBrains Mono - a popular monospaced font for coding
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <PersonaProvider>
          <div className="relative min-h-screen flex flex-col">
            <Navigation />
            <NavigationEvents />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster />
        </PersonaProvider>
      </body>
    </html>
  )
}


import './globals.css'








